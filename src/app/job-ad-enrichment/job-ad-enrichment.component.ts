import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DocumentEnriched, EnrichDocument, EnrichDocumentRequest, OntologyService } from '../ontology.service';
import { switchMap, tap } from 'rxjs';
import { SemanticConceptItem, SemanticConceptSearchAPIService, SemanticConceptSearchRequest, SemanticConceptSearchResponse } from '../semantic-concept-search-api.service';
import { TaxonomyConcept } from '../taxonomy.service';

@Component({
  selector: 'app-job-ad-enrichment',
  templateUrl: './job-ad-enrichment.component.html',
  styleUrls: ['./job-ad-enrichment.component.css']
})
export class JobAdEnrichmentComponent {

  headlineInputControl = new FormControl('');
  textInputControl = new FormControl('');
  enrichments: DocumentEnriched[] = []
  enrichedCompetencies: EnrichedCompetence[] = []

  constructor(private ontology: OntologyService, private sematicSearch: SemanticConceptSearchAPIService) { }

  ngOnInit() {
    const defaultText: string = `
    Tjänstebeskrivning & erbjudande
Älskar du att resa? Vill du även kombinera resandet med ditt arbete? Vill du även bygga en karriär inom kommunikation, marknadsföring, management och försäljning samtidigt som du har fullt av häftiga aktiviteter med dina arbetskollegor? Då är detta en perfekt roll för dig! 

Som Promotör i kampanjteamet får du en grundlig teoretisk och praktisk utbildning. Där efter kommer du vara ansiktet utåt för några av Sveriges mest kända varumärken. Du kommer möta kunder på utvalda marknadsplatser face to face.

Som en dela av teamet erbjuds du:
-	En spännande och dynamisk arbetsmiljö med mångasociala aktiviteter och chans att träffa nya människor.
-	Personligt anpassad utbildning som ger dig värdefulla erfarenheter för hela ditt arbetsliv.
-	Interna karriärmöjligheter.
-	Arbetsgivaren står för boende och resor.
-	Tävlingar där du kan vinna fantastiska priser, som resor, Appel-produkter och mycket mer.
-	En konkurrenskraftig lön med möjlighet att tjäna höga bonusar, provision och garantilön.
-	Daglig uppföljning och coaching från erfarna ledare som ger dig verktyg för att nå dina mål. 
-	Chansen att representera välkända varumärken.

Personprofil
Vi söker dig som är:
• Villig att resa.
• Lärovillig, engagerad och positiv.
• Extrovert av naturen (eller vill vara).
• Bra på personliga relationer.
• Målinriktad och självgående.
• Anpassningsbar och gillar att lyckas.
• Noga med kvalitet i arbetsuppgifterna.
• Söker professionell och personlig utveckling.
• Pratar flytande Svenska.

Vilka är Face2Face?
Face2Face är en internationell livekampanjbyrå med kontor i Norge, Sverige och Finland, med huvudkontor i Oslo.

F2F har många spännande uppdrag 2023, och söker därför nya, smarta talanger till våra livekampanjteam. Face2Face är möjligen Nordens snabbaste- fartfyllda, meningsfulla arbetsplats. Vi tror att med rätt inställning, vilja och bra träning kan du komma precis hur långt du vill.

Som promotor i våra kampanjteam får du en gedigen teoretisk och praktisk upplärning. Vi arbetar aktivt med individuell coachning, feedback och uppföljning från inspirerande chefer och erfarna medarbetare. Som promotor på Face2Face blir du ansiktet utåt för många kända varumärken. Du kommer att möta kunder på noga utvalda marknadsplatser, ute där kunderna finns – ansikte mot ansikte – och hjälpa dem att förstå och göra bra val.

Övrigt
Start: Omgående
Omfattning: Heltid.
Plats: Runt om i Sverige.
Arbetstider: Varierande.

Skicka in din ansökan redan idag då intervjuer sker löpande. Tjänsten kan komma att tillsättas innan sista ansökningsdagen.
Välkommen att söka!
    `

    this.textInputControl.setValue(defaultText)
  }
  
  enrich() {
    const document: EnrichDocument = {
      doc_id: "",
      doc_headline: this.headlineInputControl.value ?? "",
      doc_text: this.textInputControl.value ?? ""
    }

    const documentRequest: EnrichDocumentRequest = {
      documents_input: [
        document
      ],
      include_terms_info: false,
      include_sentences: true,
      include_synonyms: false,
      include_misspelled_synonyms: false
    };
    
    this.ontology.getEnrichment(documentRequest).pipe(
      tap(response => {
        this.enrichments = response
      }),
      switchMap(response => {
        const competencies = response[0].enriched_candidates.competencies.map(item => item.concept_label)
        const request: SemanticConceptSearchRequest = {
          array_of_words: competencies,
          concept_type: 'skill',
          limit_number: 1
        }
        return this.sematicSearch.conceptSearch(request)
      })
    ).subscribe(response => {
      this.enrichedCompetencies = []
        for (const enrichConcept of this.enrichments[0].enriched_candidates.competencies) {
          const semanticConcept = response[enrichConcept.concept_label][0]
          const taxConcept: TaxonomyConcept = {
            id: semanticConcept.id,
            type: semanticConcept.type,
            preferredLabel: semanticConcept.preferred_label
          }
          const item: EnrichedCompetence = {
            term: enrichConcept.term,
            sentence: enrichConcept.sentence,
            taxConcept: taxConcept
          }
          this.enrichedCompetencies.push(item)
        }
    })
  }

  empty() {
    this.headlineInputControl.setValue("")
    this.textInputControl.setValue("")
  }
}

interface EnrichedCompetence {
  term: string;
  sentence: string;
  taxConcept: TaxonomyConcept;
}