from django.apps import AppConfig


class DestinationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "destinations"

    def ready(self):
        import nltk

        try:
            nltk.data.find("corpora/wordnet")
        except LookupError:
            nltk.download("wordnet")

        # Force the corpus to fully load once, synchronously, before any
        # request thread can race to lazy-load it concurrently.
        from nltk.corpus import wordnet
        wordnet.ensure_loaded()