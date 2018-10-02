import Levenshtein as levenshtein
import itertools

examplesClusters = []

intentExamples = ['como contratar cartão', 'como contratar cartao', 'contratação de cartão de crédito', 'solicitação de cartão de crédito', 'pedir cartão débito','como peço um cartão de débito?']
permutedExamples = list(itertools.permutations(intentExamples,2))

#print(permutedExamples)

for tuple in permutedExamples:
    maxLevDist = 10
    levDist = -1*levenshtein.distance(tuple[0], tuple[1])
    if levDist <= maxLevDist:
        examplesClusters
    print(levDist)


#int(levenshtein.distance(intent_examples[4], intent_examples[5]))