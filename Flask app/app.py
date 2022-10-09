from flask import Flask, request
import json
from flask_cors import CORS
import nltk
from collections import defaultdict

app = Flask(__name__)
CORS(app)

tokenizer = nltk.RegexpTokenizer(r'\w+')

bi_count = open("json/bigram_counts.json", 'r')
tri_count = open("json/bigram_counts.json", 'r')
quad_count = open("json/bigram_counts.json", 'r')

# bigram_counts = json.load(bi_count)
# trigram_counts = json.load(tri_count)
# quadgram_counts = json.load(quad_count)

bigram_counts = defaultdict(int,json.load(bi_count))
trigram_counts = defaultdict(int,json.load(tri_count))
quadgram_counts = defaultdict(int,json.load(quad_count))

bi_p = open("json/bigram_prob.json", 'r')
tri_p = open("json/trigram_prob.json", 'r')
quad_p = open("json/quadgram_prob.json", 'r')

# bigram_prob = json.load(bi_p)
# trigram_prob = json.load(tri_p)
# quadgram_prob = json.load(quad_p)

bigram_prob = defaultdict(int,json.load(bi_p))
trigram_prob = defaultdict(int,json.load(tri_p))
quadgram_prob = defaultdict(int,json.load(quad_p))

v = open("json/vocab.json", 'r')
# vocab = json.load(v)
vocab = defaultdict(int,json.load(v))

# print(bigram_counts)

@app.route('/')
def home():
    return "Hello World!"

@app.route('/suggest',methods=['GET'])
def doPredictions():
    sentence = request.args.get("sentence")
    end_word = None
    incomplete = False

    if sentence[-1] != " ":
        end_word = sentence.split()[-1]
        incomplete = True
        sentence = " ".join(sentence.split()[:-1])

    choices = {word[1] for word in getWordChoices(sentence)}
    predictions = []

    V = len(vocab)
    num_words = sum(vocab.values())

    if incomplete:
        choices = set(choices.union(vocab.keys()))
        choices = get_close_matches(end_word, choices, n=30)

    for word in choices:
        key = sentence + word
        quad_token = " ".join(key.split()[-4:])

        prob = (
            (quadgram_counts[quad_token] + 1)/ (trigram_counts[" ".join(quad_token.split()[-3:])] + V) + 
            (trigram_counts[" ".join(quad_token.split()[-3:])] + 1)/ (bigram_counts[" ".join(quad_token.split()[-2:])] + V) +
            (bigram_counts[" ".join(quad_token.split()[-2:])] + 1)/ (vocab[word] + V) + 
            (vocab[word] + 1)/ (num_words + V)
        )

        if incomplete:
            similarity = SequenceMatcher(None, end_word, word).ratio()
            predictions.append([similarity, prob, word])
        else:
            predictions.append([prob, word])

    predictions = sorted(predictions, reverse=True)
    # print(predictions)
    best_preds = [pred[-1] for pred in predictions[:4]]
    return best_preds

def getWordChoices(sentence):
    choices = []
    tokens = tokenizer.tokenize(sentence.lower())
    if tokens[-1] in bigram_prob:
        # print(tokens[-1], bigram_prob[tokens[-1]])
        choices += bigram_prob[tokens[-1]]

    # print(tokens[-2:])
    if " ".join(tokens[-2:]) in trigram_prob:
        # print(" ".join(tokens[-2:]), trigram_prob[" ".join(tokens[-2:])])
        choices += trigram_prob[" ".join(tokens[-2:])]

    if " ".join(tokens[-3:]) in quadgram_prob:
        # print(" ".join(tokens[-3:]), quadgram_prob[" ".join(tokens[-3:])])
        choices += quadgram_prob[" ".join(tokens[-3:])]

    return choices