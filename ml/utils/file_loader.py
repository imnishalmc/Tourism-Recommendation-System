import os
import pandas as pd

from config import DATASET_PATH


class FileLoader:

    @staticmethod
    def load_dataset():

        if not os.path.exists(DATASET_PATH):
            raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

        try:
            df = pd.read_csv(DATASET_PATH)
        except Exception as e:
            raise Exception(f"Error loading dataset: {e}")

        if df.empty:
            raise ValueError("Dataset is empty.")

        return df

    @staticmethod
    def get_dataset_shape():

        df = FileLoader.load_dataset()
        return df.shape

    @staticmethod
    def get_columns():

        df = FileLoader.load_dataset()
        return list(df.columns)