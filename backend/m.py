import pandas as pd
from pathlib import Path

path = Path("backend/data/fao_crop_yield.csv")
df = pd.read_csv(path, on_bad_lines='skip')

print(df[df['Dist Name'].str.upper() == 'BAREILLY'][['Dist Name', 'Year', 'WHEAT YIELD (Kg per ha)']].head(10))