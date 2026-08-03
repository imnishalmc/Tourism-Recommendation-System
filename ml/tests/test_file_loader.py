from utils.file_loader import FileLoader

df = FileLoader.load_dataset()

print("Dataset Loaded Successfully")
print()

print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

print()

print("Column Names:")

for column in df.columns:
    print(column)