import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


MODEL_ID = "google/gemma-3-1b-pt"

print("Loading Gemma model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    dtype=torch.float32
)

model.eval()

print("Gemma model loaded!")


def analyze_report(report_text: str):
    """
    Analyze a user safety report using pretrained Gemma
    and convert the report into structured safety features.
    """

    prompt = f"""
Analyze this safety report:

{report_text}

Identify whether it mentions:
- lighting problems
- dogs or stray animals

Explain your findings briefly.
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=40,
            do_sample=False
        )

    generated_text = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )

    print("Gemma analysis:")
    print(generated_text)

    # Convert the original unstructured report
    # into structured safety features.

    text = report_text.lower()

    lighting_issue = int(any(word in text for word in [
        "dark",
        "darkness",
        "unlit",
        "no light",
        "streetlight",
        "street light",
        "broken light",
        "broken streetlight",
        "poor lighting",
        "poorly lit",
    ]))

    dog_issue = int(any(word in text for word in [
        "dog",
        "dogs",
        "stray",
        "strays",
        "animal",
        "animals",
    ]))

    return {
        "lighting_issue": lighting_issue,
        "dog_issue": dog_issue,
    }