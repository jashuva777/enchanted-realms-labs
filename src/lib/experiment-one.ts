import titanic from '@/assets/lab-1/titanic.csv.asset.json';
import text from '@/assets/lab-1/data_set.txt.asset.json';
import json from '@/assets/lab-1/data.json.asset.json';
import studentJson from '@/assets/lab-1/student_data.json.asset.json';
import studentExcel from '@/assets/lab-1/student_data.xlsx.asset.json';
import collegeExcel from '@/assets/lab-1/college_data.xlsx.asset.json';
import iris from '@/assets/lab-1/iris.csv.asset.json';
import notebook from '@/assets/lab-1/ds_lab1_final.ipynb.asset.json';
import draftNotebook from '@/assets/lab-1/ds.ipynb.asset.json';
import otherNotebook from '@/assets/lab-1/dsa_lab_1.ipynb.asset.json';
import script from '@/assets/lab-1/ds.py.asset.json';

export type LabFile = { name: string; url: string; runtime: boolean };
export const experimentOneFiles: LabFile[] = [
  ...[titanic, text, json, studentJson, studentExcel, collegeExcel, iris].map(asset => ({ name: asset.original_filename, url: asset.url, runtime: true })),
  ...[notebook, draftNotebook, otherNotebook, script].map(asset => ({ name: asset.original_filename, url: asset.url, runtime: false })),
];

export const experimentOneCode = `import pandas as pd
from io import StringIO
from pyodide.http import pyfetch

print("CSV: Titanic")
titanic_df = pd.read_csv("titanic.csv")
print(titanic_df.head().to_string(index=False))

print("\\nCSV from URL: Iris")
response = await pyfetch("https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv")
df_from_url = pd.read_csv(StringIO(await response.string()))
print(df_from_url.head().to_string(index=False))

print("\\nTab-separated text")
df_from_txt = pd.read_table("data_set.txt", sep="\\t")
print(df_from_txt.head().to_string(index=False))

student_data = {
    "Roll_No": [10, 20, 30, 40, 50],
    "Name": ["Praneeth", "Reddy", "Karthik", "Tharun", "Shiva"],
    "Department": ["IT", "CSE", "AIML", "DS", "CS"],
    "Percentage": [90, 86, 92, 88, 95],
}
df_from_dict = pd.DataFrame(student_data)
print("\\nDictionary to DataFrame")
print(df_from_dict.to_string(index=False))

df_from_json = pd.read_json("data.json")
print("\\nJSON")
print(df_from_json.head().to_string(index=False))

print("\\nProvided Excel workbook")
workbook = pd.read_excel("college_data.xlsx", sheet_name=None)
print("Sheets:", list(workbook.keys()))
for name, frame in workbook.items():
    print(name)
    print(frame.head().to_string(index=False))

df_from_dict.to_json("exported_students.json", orient="records", indent=2)
with pd.ExcelWriter("exported_college.xlsx", engine="openpyxl") as writer:
    df_from_dict.to_excel(writer, sheet_name="Students", index=False)
    df_from_txt.to_excel(writer, sheet_name="Marks", index=False)
print("\\nExported JSON and multi-sheet Excel successfully.")
`;