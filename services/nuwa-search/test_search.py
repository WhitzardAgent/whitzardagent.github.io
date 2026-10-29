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
if __name__=='__main__':unittest.main()

class FilterBeforeLimitTests(unittest.TestCase):
 def test_filtered_types_cannot_be_crowded_out(self):
  docs=[{'id':str(i),'objectId':str(i),'type':'research','title':'Safety','text':'safety','section':'title','locale':'en','areas':[],'url':'/'}for i in range(120)]
  docs.append({'id':'target','objectId':'target','type':'benchmark','title':'Safety benchmark','text':'safety task','section':'task','locale':'en','areas':[],'url':'/'})
  e=SearchEngine({'candidateId':'v','documents':docs})
  self.assertEqual(e.search({'query':'safety','filters':{'type':'benchmark'}})['hits'][0]['objectId'],'target')
