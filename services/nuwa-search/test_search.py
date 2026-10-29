import unittest
from engine import SearchEngine
class SearchTests(unittest.TestCase):
 def setUp(self):
  self.e=SearchEngine({'candidateId':'v1','documents':[{'id':'research:shutdown:limits:en','objectId':'shutdown','type':'research','title':'Shutdown resistance','text':'agents resist being shut down','section':'limits','locale':'en','areas':['autonomy'],'url':'/work/shutdown/'},{'id':'benchmark:cybench:task:en','objectId':'cybench','type':'benchmark','title':'Cybench','text':'cybersecurity tasks','section':'task','locale':'en','areas':['cybersecurity'],'url':'/benchmark/cybench/'}]})
 def test_typo_and_natural_question(self):
  self.assertEqual(self.e.search({'query':'cybnech'})['hits'][0]['objectId'],'cybench')
  self.assertEqual(self.e.search({'query':'Can agents resist being shut down?'})['hits'][0]['objectId'],'shutdown')
 def test_filters_version_and_empty(self):
  self.assertEqual(self.e.search({'query':'shutdown','filters':{'type':'benchmark'}})['hits'],[])
  with self.assertRaises(ValueError):self.e.search({'query':'x','snapshotId':'stale'})
  self.assertEqual(self.e.search({'query':'unrelated nonsense'})['hits'],[])
 def test_no_fake_semantic_and_chunk_dedup(self):
  r=self.e.search({'query':'shutdown'})
  self.assertEqual(r['mode'],'lexical');self.assertEqual(r['snapshotId'],'v1')

class FilterBeforeLimitTests(unittest.TestCase):
 def test_filtered_types_cannot_be_crowded_out(self):
  docs=[{'id':str(i),'objectId':str(i),'type':'research','title':'Safety','text':'safety','section':'title','locale':'en','areas':[],'url':'/'}for i in range(120)]
  docs.append({'id':'target','objectId':'target','type':'benchmark','title':'Safety benchmark','text':'safety task','section':'task','locale':'en','areas':[],'url':'/'})
  e=SearchEngine({'candidateId':'v','documents':docs})
  self.assertEqual(e.search({'query':'safety','filters':{'type':'benchmark'}})['hits'][0]['objectId'],'target')

class TypedEvaluationTests(unittest.TestCase):
 def test_benchmark_is_a_relevant_object(self):
  from evaluate import evaluate
  corpus={'candidateId':'v','documents':[{'id':'b','objectId':'cybench','type':'benchmark','title':'Cybench','text':'Cyber tasks','section':'task','locale':'en','url':'/'}]}
  r=evaluate(corpus,[{'id':'b','category':'exact','query':'Cybench','expected':[{'type':'benchmark','id':'cybench','relevance':2}]}])
  self.assertEqual(r['exactTop1'],1);self.assertEqual(r['ndcg10'],1)
 def test_snippet_locates_late_evidence(self):
  from engine import matching_snippet
  self.assertIn('shutdown resistance',matching_snippet('Introduction. '*100+'shutdown resistance is observed','shutdown resistance'))

class VectorCacheTests(unittest.TestCase):
 def corpus(self,version='v1',text='first document'):
  return {'candidateId':version,'documents':[{'id':'a','objectId':'a','type':'research','title':'Alpha','text':text,'section':'findings','locale':'en','url':'/a/'}]}
 def test_unchanged_content_reuses_vectors_across_editions(self):
  import tempfile
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'vectors.json';e=SearchEngine(self.corpus(),path)
   calls=[];e.embedding=lambda values:calls.extend(values) or [[1.0]+[0.0]*1023 for _ in values]
   e.prepare_vectors();self.assertEqual(len(calls),1)
   updated=SearchEngine(self.corpus('v2'),path)
   self.assertFalse(updated.semantic_ready)
   updated.embedding=lambda _:self.fail('unchanged content must not be embedded twice')
   updated.prepare_vectors();self.assertTrue(updated.semantic_ready)
   changed=SearchEngine(self.corpus('v3','changed findings'),path)
   self.assertFalse(changed.semantic_ready);self.assertEqual(changed.vectors,{})
 def test_invalid_vector_is_never_accepted(self):
  import tempfile,json
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'vectors.json';e=SearchEngine(self.corpus(),path)
   e.embedding=lambda values:[[1.0]+[0.0]*1023 for _ in values];e.prepare_vectors()
   data=json.loads(path.read_text());key=next(iter(data['entries']))
   for bad in [[1.0], [float('nan')]+[0.0]*1023, [0.0]*1024]:
    data['entries'][key]=bad;path.write_text(json.dumps(data))
    restored=SearchEngine(self.corpus(),path)
    self.assertFalse(restored.semantic_ready);self.assertEqual(restored.vectors,{})
 def test_incomplete_embedding_batch_fails_without_cache_publication(self):
  import tempfile
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'vectors.json';e=SearchEngine(self.corpus(),path);e.embedding=lambda _:[]
   with self.assertRaises(ValueError):e.prepare_vectors()
   self.assertFalse(path.exists())
 def test_model_configuration_cannot_reuse_vectors(self):
  import tempfile,os
  from unittest.mock import patch
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'vectors.json';e=SearchEngine(self.corpus(),path)
   e.embedding=lambda values:[[1.0]+[0.0]*1023 for _ in values];e.prepare_vectors()
   with patch.dict(os.environ,{'NUWA_EMBED_MODEL':'different-model'}):
    other=SearchEngine(self.corpus(),path);self.assertEqual(other.vectors,{})
 def test_invalid_query_vector_downgrades_explicitly(self):
  import tempfile
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   e=SearchEngine(self.corpus(),Path(tmp)/'vectors.json')
   e.embedding=lambda values:[[1.0]+[0.0]*1023 for _ in values];e.prepare_vectors();e.api_key='test'
   e.embedding=lambda _:[[float('inf')]+[0.0]*1023]
   result=e.search({'query':'Alpha'})
   self.assertEqual(result['mode'],'lexical');self.assertIn('unavailable',result['notice'])

class HybridEvaluationTests(unittest.TestCase):
 def test_hybrid_evaluation_rejects_missing_credentials(self):
  import os
  from unittest.mock import patch
  from evaluate import evaluate
  with patch.dict(os.environ,{},clear=True):
   with self.assertRaises(ValueError):evaluate({'candidateId':'v','documents':[]},[],mode='hybrid')
 def test_cache_reuse_still_requires_current_document_manifest(self):
  import tempfile,json
  from pathlib import Path
  with tempfile.TemporaryDirectory() as tmp:
   path=Path(tmp)/'cache.json'
   doc={'id':'a','objectId':'a','type':'opinion','title':'Monitorability','text':'Observation of reasoning','locale':'en','section':'claim','url':'/opinion/a/'}
   e=SearchEngine({'candidateId':'v','documents':[doc]},path)
   e.embedding=lambda values:[[1.0]+[0.0]*1023 for _ in values];e.prepare_vectors()
   data=json.loads(path.read_text());data['documents']['a']='incorrect-fingerprint';path.write_text(json.dumps(data))
   restored=SearchEngine({'candidateId':'v','documents':[doc]},path)
   self.assertFalse(restored.semantic_ready)
 def test_graded_types_and_cold_warm_metrics(self):
  from evaluate import evaluate
  doc={'id':'a','objectId':'a','type':'opinion','title':'Monitorability','text':'Monitorability of reasoning','locale':'en','section':'claim','url':'/opinion/a/'}
  result=evaluate({'candidateId':'v','documents':[doc]},[{'id':'q','category':'exact','query':'Monitorability','expected':[{'type':'opinion','id':'a','relevance':3}]}])
  self.assertEqual(result['ndcg10'],1);self.assertEqual(result['categories']['exact']['top1'],1)
  self.assertGreaterEqual(result['coldP95Ms'],0);self.assertGreaterEqual(result['warmP95Ms'],0)

if __name__=='__main__':unittest.main()

class SourceAnchorTests(unittest.TestCase):
 def test_research_anchor_and_locale_are_clickable(self):
  e=SearchEngine({'candidateId':'v','documents':[{'id':'s','objectId':'study','type':'research','title':'Study','text':'shutdown finding','section':'findings','locale':'en','url':'/nuwa/whitzard-index/work/study/','anchor':'claim-study-findings'}]})
  self.assertEqual(e.search({'query':'shutdown','locale':'en'})['hits'][0]['url'],'/en/nuwa/whitzard-index/work/study/#claim-study-findings')
