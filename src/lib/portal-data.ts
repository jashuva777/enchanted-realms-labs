import { suppliedExperiments } from './supplied-experiments';
import { experimentOneCode, experimentOneFiles, type LabFile } from './experiment-one';
export type Experiment = { id: string; title: string; description: string; tag: string; duration: string; aim: string; procedure: string[]; code: string; files?: LabFile[]; videoSearch?: string; variants?: { label: string; code: string }[]; notice?: string };
export const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jashuva-sangam-243348408/' },
  { name: 'GitHub', url: 'https://github.com/jashuva777' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/jashuva_777/' },
  { name: 'Instagram', url: 'https://www.instagram.com/tikku_777/?hl=en' },
];

export { modules } from './syllabus';
export const experiments: Experiment[] = [
  { id: 'EXP-001', title: 'Data Import and Export with Pandas', description: 'Read CSV, text, JSON and Excel, create DataFrames, and export your results.', tag: 'PANDAS · FILE I/O', duration: '30 min', aim: 'Load data from local files and a URL, construct a DataFrame from a dictionary, and export JSON and multi-sheet Excel files.', procedure: ['Import Pandas and load the provided Titanic CSV.', 'Retrieve the Iris CSV from a URL and read the tab-separated text file.', 'Create a student DataFrame from a dictionary and inspect JSON data.', 'Read the provided Excel workbook and inspect its sheets.', 'Export a JSON file and a multi-sheet Excel workbook.'], code: experimentOneCode, files: experimentOneFiles, videoSearch: 'pandas read csv json excel data import export tutorial' },
  ...suppliedExperiments,
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
