import type { Experiment } from './portal-data';

const groupCode = `import pandas as pd

df = pd.DataFrame({
    'Name': ['Ravi', 'Sita', 'Arun', 'Priya', 'Kiran', 'Anil', 'Lakshmi', 'Rahul'],
    'Department': ['CSE', 'CSE', 'ECE', 'ECE', 'CSE', 'ECE', 'CSE', 'ECE'],
    'Year': [2, 2, 3, 3, 2, 3, 3, 2],
    'Marks': [85, 90, 78, 88, 75, 82, 95, 70]
})
print('Original DataFrame:')
print(df)
for department, group in df.groupby('Department'):
    print('\nDepartment:', department)
    print(group)
print('\nAverage Marks by Department:')
print(df.groupby('Department')['Marks'].mean())
for keys, group in df.groupby(['Department', 'Year']):
    print('\nGroup:', keys)
    print(group)
print('\nAverage Marks by Department and Year:')
print(df.groupby(['Department', 'Year'])['Marks'].mean())
print('\nMultiple selected columns:')
print(df.groupby('Department')[['Year', 'Marks']].mean())
`.replaceAll("'\n", "'\\n");

const aggregateCode = `import pandas as pd
df = pd.DataFrame({
    'Department': ['CSE', 'CSE', 'CSE', 'ECE', 'ECE', 'ECE', 'EEE', 'EEE', 'EEE'],
    'Marks': [80, 75, 85, 70, 65, 75, 90, 85, 95],
    'Attendance': [90, 85, 95, 80, 75, 85, 95, 90, 100]
})
print(df)
print(df.groupby('Department').aggregate({
    'Marks': ['sum', 'mean', 'std'],
    'Attendance': ['sum', 'mean', 'std']
}))`;

const irisCode = `import pandas as pd
from io import StringIO
from pyodide.http import pyfetch

url = 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv'
response = await pyfetch(url)
if not response.ok:
    raise RuntimeError(f'Dataset request failed: {response.status}')
df = pd.read_csv(StringIO(await response.string()))
print('First 5 Records:')
print(df.head())
df.info()
print(df.describe())
print(df.groupby('species')['sepal_length'].agg(['count', 'sum', 'mean', 'std', 'min', 'max']))
print(df.groupby(['species', 'sepal_width'])['sepal_length'].mean().head(15))
print(df.groupby('species').agg({
    'sepal_length': ['mean', 'std', 'min', 'max'],
    'sepal_width': ['mean', 'std', 'min', 'max'],
    'petal_length': ['mean', 'std', 'min', 'max'],
    'petal_width': ['mean', 'std', 'min', 'max']
}))
print(df['species'].value_counts())
print(df.groupby('species')[['petal_length', 'petal_width']].mean())
print(df.groupby('species')['sepal_length'].max())`;

// The source document provides no HTML dataset. Inline sample HTML keeps every
// part independently runnable and editable without scraping restricted sites.
const scrapeCode = `from bs4 import BeautifulSoup
import pandas as pd

# Illustrative reviews, not scraped Amazon customer data. Edit this HTML.
html_content = """
<div class="review"><h3 class="review-title">Great product</h3><span class="rating">5 out of 5</span><p class="review-text">The quality is excellent and I love it. Works perfectly after 30 days!</p></div>
<div class="review"><h3 class="review-title">Not satisfied</h3><span class="rating">2 out of 5</span><p class="review-text">The product is terrible and broke after 2 days. Very disappointed.</p></div>
<div class="review"><h3 class="review-title">Worth buying</h3><span class="rating">4 out of 5</span><p class="review-text">Good performance and great value for 500 rupees.</p></div>
<div class="review"><h3 class="review-title">Average</h3><span class="rating">3 out of 5</span><p class="review-text">The package contains 1 item and a manual.</p></div>
<div class="review"><h3 class="review-title">Poor service</h3><span class="rating">1 out of 5</span><p class="review-text">Awful service and bad quality. I hate the slow delivery.</p></div>
<div class="review"><h3 class="review-title">Happy customer</h3><span class="rating">5 out of 5</span><p class="review-text">Amazing product! Easy to use and absolutely wonderful.</p></div>
"""
soup = BeautifulSoup(html_content, 'html.parser')
records = []
for block in soup.select('.review'):
    def field(selector):
        element = block.select_one(selector)
        return element.get_text(' ', strip=True) if element else ''
    review = field('.review-text')
    if review:
        records.append({'title': field('.review-title'), 'review': review, 'rating': field('.rating')})
df = pd.DataFrame(records, columns=['title', 'review', 'rating'])
if df.empty:
    raise ValueError('No reviews found. Check the HTML and selectors.')
df.to_csv('product_reviews.csv', index=False)
print(df)
print('Total reviews extracted:', len(df))
`;

const sentimentCode = `
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyzer = SentimentIntensityAnalyzer()
def classify(score):
    return 'Positive' if score >= 0.05 else 'Negative' if score <= -0.05 else 'Neutral'
scores = df['review'].apply(analyzer.polarity_scores)
df['vader_compound'] = scores.apply(lambda score: score['compound'])
df['vader_sentiment'] = df['vader_compound'].apply(classify)
`;

const cloudCode = scrapeCode + sentimentCode + `
import matplotlib.pyplot as plt
from wordcloud import WordCloud
for label in ['All', 'Positive', 'Negative']:
    reviews = df['review'] if label == 'All' else df.loc[df['vader_sentiment'] == label, 'review']
    text = ' '.join(reviews)
    if not text.strip():
        print('No reviews for', label)
        continue
    cloud = WordCloud(width=1000, height=500, background_color='white', collocations=False, random_state=42).generate(text)
    cloud.to_file(f'wordcloud_{label.lower()}.png')
    plt.figure(figsize=(10, 5))
    plt.imshow(cloud, interpolation='bilinear')
    plt.axis('off')
    plt.title(f'WordCloud - {label} Reviews')
    plt.show()
df.to_csv('product_reviews_analyzed.csv', index=False)
print(df['vader_sentiment'].value_counts())`;

const statisticsCode = scrapeCode + String.raw`
import re
import nltk
from nltk.corpus import stopwords
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns

stop_words = set(stopwords.words('english'))
def analyze_review(text):
    tokens = re.findall(r"\b[\w']+\b", text.lower())
    words = re.findall(r'\b[A-Za-z]+\b', text)
    return pd.Series({
        'word_count': len(tokens),
        'character_count': len(text),
        'numeric_count': len(re.findall(r'\b\d+(?:\.\d+)?\b', text)),
        'stopword_count': sum(token in stop_words for token in tokens),
        'average_word_length': sum(map(len, words)) / len(words) if words else 0
    })
df = pd.concat([df, df['review'].apply(analyze_review)], axis=1)
columns = ['stopword_count', 'numeric_count', 'word_count', 'character_count', 'average_word_length']
fig, axes = plt.subplots(3, 2, figsize=(12, 12))
for column, ax in zip(columns, axes.flat):
    sns.histplot(data=df, x=column, bins=10, ax=ax)
    ax.set_title(column.replace('_', ' ').title())
axes.flat[-1].axis('off')
plt.tight_layout()
plt.savefig('review_statistics_distributions.png', dpi=120)
plt.show()
frequency = Counter(token for token in re.findall(r"\b[\w']+\b", ' '.join(df['review']).lower()) if token in stop_words)
print('Top 10 stopwords:', frequency.most_common(10))
print(df[columns].describe())
df.to_csv('review_statistics.csv', index=False)
`;

const compareCode = scrapeCode + sentimentCode + `
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer as NLTKVADER
nltk_analyzer = NLTKVADER()
nltk_scores = df['review'].apply(nltk_analyzer.polarity_scores)
for name, key in [('positive', 'pos'), ('negative', 'neg'), ('neutral', 'neu'), ('compound', 'compound')]:
    df['nltk_' + name] = nltk_scores.apply(lambda score: score[key])
    df['vader_' + name] = scores.apply(lambda score: score[key])
df['nltk_sentiment'] = df['nltk_compound'].apply(classify)
print(df[['review', 'nltk_compound', 'nltk_sentiment', 'vader_compound', 'vader_sentiment']].to_string(index=False))
print(df['nltk_sentiment'].value_counts())
print(df['vader_sentiment'].value_counts())
df.to_csv('sentiment_analysis_results.csv', index=False)`;

const scatterCode = scrapeCode + sentimentCode + `
import matplotlib.pyplot as plt
import seaborn as sns
df['review_index'] = range(1, len(df) + 1)
plt.figure(figsize=(10, 5))
sns.scatterplot(data=df, x='review_index', y='vader_compound', hue='vader_sentiment', palette={'Positive': 'green', 'Negative': 'red', 'Neutral': 'gray'}, s=70)
plt.axhline(0.05, color='green', linestyle='--', label='Positive threshold')
plt.axhline(-0.05, color='red', linestyle='--', label='Negative threshold')
plt.axhline(0, color='black', linestyle=':')
plt.ylim(-1.05, 1.05)
plt.xlabel('Review Index')
plt.ylabel('VADER Compound Sentiment Score')
plt.title('Sentiment Intensity of Product Reviews')
plt.legend()
plt.tight_layout()
plt.savefig('sentiment_intensity_scatter.png', dpi=120)
plt.show()
print(df[['review_index', 'vader_compound', 'vader_sentiment']])`;

export const documentExperiments: Experiment[] = [
  { id: 'EXP-007', title: 'Data Aggregation', description: 'Group data by single and multiple keys, aggregate statistics, and explore Iris.', tag: 'GROUPBY · AGGREGATION', duration: '30 min', aim: 'Group and aggregate tabular data.', procedure: [], code: groupCode, codeOnly: true, variants: [{ label: '7A · GroupBy', code: groupCode }, { label: '7B · Summary statistics', code: aggregateCode }, { label: '7C · Online Iris analysis', code: irisCode }], videoSearch: 'pandas groupby aggregation tutorial', videos: [{ title: 'Pandas: Grouping and Aggregating', url: 'https://www.youtube.com/watch?v=txMdrV1Ut64' }] },
  { id: 'EXP-008', title: 'Web Scraping and Review Analysis', description: 'Extract reviews with Beautiful Soup, generate word clouds, and analyze sentiment.', tag: 'BEAUTIFUL SOUP · NLP', duration: '30 min', aim: 'Extract and analyze product reviews.', procedure: [], code: scrapeCode, codeOnly: true, variants: [{ label: '8A · Extract reviews', code: scrapeCode }, { label: '8B · Word clouds', code: cloudCode }, { label: '8C · Text statistics', code: statisticsCode }, { label: '8D · NLTK and VADER', code: compareCode }, { label: '8E · Sentiment scatter', code: scatterCode }], videoSearch: 'Python NLTK VADER wordcloud sentiment analysis Rob Mulla', videos: [{ title: 'Web Scraping with BeautifulSoup', url: 'https://www.youtube.com/watch?v=ng2o98k983k' }] }
];