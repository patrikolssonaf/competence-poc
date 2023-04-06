POC Taxonomy Skills vs Ontology Skills

Use JobSearch complete endpoint to get ontology skills from taxonomy skills.
Use qfields parameter to filter response to only include skills.
Use skill parameter for every Taxonomy skill.
https://jobsearch.api.jobtechdev.se/complete?qfields=skill&skill=G4sF_xod_zoq&skill=85vp_6Vr_4N1

{
    "result_time_in_millis": 149,
    "time_in_millis": 15,
    "typeahead": [
        {
            "value": "installation",
            "found_phrase": "installation",
            "type": "skill",
            "occurrences": 3
        },
        {
            "value": "microsoft exchange",
            "found_phrase": "microsoft exchange",
            "type": "skill",
            "occurrences": 3
        }
    ]
}

Convert a Ontology skill to Taxonomy Occupations
Use JobSearch search endpoint to make search.
Put all Ontology skills in the query parameter and prefix each by a plus sign.
Use stats parameter return the Taxonomy Occupations included in the result
Set offset to zero because we dont need the search result
https://jobsearch.api.jobtechdev.se/search?q=%2Bmicrosoft%20exchange%20%2Bsvenska&offset=0&limit=0&stats=occupation-name

{
  "total": {
    "value": 79
  },
  "positions": 0,
  "query_time_in_millis": 6,
  "result_time_in_millis": 52,
  "stats": [
    {
      "type": "occupation-name",
      "values": [
        {
          "term": "Helpdesktekniker/Supporttekniker",
          "concept_id": "KQty_E1u_cia",
          "code": "7020",
          "count": 45
        },
        {
          "term": "IT-tekniker/Datatekniker",
          "concept_id": "tdCZ_6Pn_VzT",
          "code": "6625",
          "count": 17
        },
        {
          "term": "Nätverksoperatör",
          "concept_id": "UNnG_geo_74L",
          "code": "2519",
          "count": 5
        },
        {
          "term": "Drifttekniker, data",
          "concept_id": "Cb5F_v1d_4qK",
          "code": "5431",
          "count": 4
        },
        {
          "term": "Systemadministratör",
          "concept_id": "Lxas_8K9_W1o",
          "code": "2918",
          "count": 2
        }
      ]
    }
  ],
  "freetext_concepts": {
    "skill": [],
    "occupation": [],
    "location": [],
    "skill_must": [
      "microsoft exchange",
      "svenska"
    ],
    "occupation_must": [],
    "location_must": [],
    "skill_must_not": [],
    "occupation_must_not": [],
    "location_must_not": []
  },
  "hits": []
}