import { experimentOneCode, experimentOneFiles, type LabFile } from './experiment-one';
export type Experiment = { id: string; title: string; description: string; tag: string; duration: string; aim: string; procedure: string[]; code: string; files?: LabFile[]; videoSearch?: string };
export const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jashuva-sangam-243348408/' },
  { name: 'GitHub', url: 'https://github.com/jashuva777' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/jashuva_777/' },
  { name: 'Instagram', url: 'https://www.instagram.com/tikku_777/?hl=en' },
];

export { modules } from './syllabus';
export const experiments: Experiment[] = [
  { id: 'EXP-001', title: 'Data Import and Export with Pandas', description: 'Read CSV, text, JSON and Excel, create DataFrames, and export your results.', tag: 'PANDAS · FILE I/O', duration: '30 min', aim: 'Load data from local files and a URL, construct a DataFrame from a dictionary, and export JSON and multi-sheet Excel files.', procedure: ['Import Pandas and load the provided Titanic CSV.', 'Retrieve the Iris CSV from a URL and read the tab-separated text file.', 'Create a student DataFrame from a dictionary and inspect JSON data.', 'Read the provided Excel workbook and inspect its sheets.', 'Export a JSON file and a multi-sheet Excel workbook.'], code: experimentOneCode, files: experimentOneFiles, videoSearch: 'pandas read csv json excel data import export tutorial' },
  { id: 'EXP-002', title: 'NumPy Array Operations', description: 'Work with arrays and vectorized numerical operations.', tag: 'NUMPY', duration: '20 min', aim: 'Create numerical arrays and perform vectorized arithmetic and dot products.', procedure: ['Import NumPy and create two arrays.', 'Perform addition, multiplication and a dot product.', 'Modify the arrays and observe the resulting dimensions.'], code: 'import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\n\nprint("Array a:", a)\nprint("Array b:", b)\nprint("Addition:", a + b)\nprint("Scaled:", a * 10)\nprint("Dot product:", np.dot(a, b))' },
  { id: 'EXP-003', title: 'Data Analysis with Pandas', description: 'Build, explore, and summarize a real-world data table.', tag: 'PANDAS', duration: '25 min', aim: 'Construct a DataFrame and aggregate sales by category.', procedure: ['Create a dictionary of category and sales data.', 'Convert it to a Pandas DataFrame.', 'Group by category and calculate total sales.'], code: 'import pandas as pd\n\ndata = {\n    "Category": ["Tech", "Food", "Tech", "Food"],\n    "Sales": [500, 200, 300, 150]\n}\ndf = pd.DataFrame(data)\n\nprint("Sales data:")\nprint(df.to_string(index=False))\nprint("\nSales by category:")\nprint(df.groupby("Category")["Sales"].sum())' },
  { id: 'EXP-004', title: 'Random Sampling', description: 'Estimate pi through a Monte Carlo simulation.', tag: 'PROBABILITY', duration: '20 min', aim: 'Use random sampling to estimate pi from points in a unit square.', procedure: ['Generate reproducible random coordinate pairs.', 'Count points within a quarter of the unit circle.', 'Estimate pi and compare it with the known value.'], code: 'import random\nimport math\n\nrandom.seed(42)\nn = 10000\ninside = sum(\n    1 for _ in range(n)\n    if random.random() ** 2 + random.random() ** 2 <= 1\n)\nestimate = 4 * inside / n\nprint("Samples:", n)\nprint("Estimated pi:", estimate)\nprint("Actual pi:", round(math.pi, 4))\nprint("Absolute error:", round(abs(estimate - math.pi), 4))' },
  { id: 'EXP-005', title: 'Data Cleaning', description: 'Identify missing values and prepare a reliable dataset.', tag: 'PREPROCESSING', duration: '20 min', aim: 'Identify missing scores and replace them using mean imputation.', procedure: ['Create a DataFrame containing missing values.', 'Count null values and calculate the observed mean.', 'Fill missing values and verify the cleaned dataset.'], code: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({"Score": [85, 90, np.nan, 70, np.nan]})\nprint("Missing before:", df["Score"].isna().sum())\nmean_score = df["Score"].mean()\ndf["Score"] = df["Score"].fillna(mean_score)\n\nprint("Imputation mean:", round(mean_score, 2))\nprint("Cleaned scores:", df["Score"].round(2).tolist())\nprint("Missing after:", df["Score"].isna().sum())' },
  { id: 'EXP-006', title: 'Linear Trend Estimation', description: 'Discover relationships with your first regression model.', tag: 'REGRESSION', duration: '25 min', aim: 'Fit a straight line to observations and predict a new value.', procedure: ['Define independent and dependent observations.', 'Fit a first-degree polynomial using NumPy.', 'Print the equation and predict the value at x = 6.'], code: 'import numpy as np\n\nx = np.array([1, 2, 3, 4, 5])\ny = np.array([2.1, 3.9, 6.2, 8.1, 10.5])\nslope, intercept = np.polyfit(x, y, 1)\n\nprint(f"Equation: y = {slope:.2f}x + {intercept:.2f}")\nprint(f"Prediction for x=6: {slope * 6 + intercept:.2f}")\nprint("Observed:", y)\nprint("Fitted:", np.round(slope * x + intercept, 2))' },
];

export const tools = [
  { name: 'Python', symbol: 'Py', url: 'https://docs.python.org/3/' },
  { name: 'Jupyter', symbol: '◌', url: 'https://jupyter.org/' },
  { name: 'Pandas', symbol: 'pd', url: 'https://pandas.pydata.org/docs/' },
  { name: 'NumPy', symbol: 'N', url: 'https://numpy.org/doc/' },
  { name: 'Matplotlib', symbol: '▥', url: 'https://matplotlib.org/stable/' },
  { name: 'SQL', symbol: 'SQL', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
  { name: 'Power BI', symbol: '▥', url: 'https://learn.microsoft.com/en-us/power-bi/' },
];

export function pageMeta(title: string, description: string) {
  return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}
