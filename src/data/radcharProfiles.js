export const radcharProfiles = [
  {
    id: "frequency-agile",
    name: "Frequency Agile Hopping",
    band: "L / S-band",
    waveform: "Burst hopping with intermittent dwell",
    dutyCycle: "18%",
    signature:
      "Fast channel switching and agile dwell bursts consistent with emitter agility models.",
  },
  {
    id: "rotating-mainbeam",
    name: "Rotating Mainbeam",
    band: "C-band",
    waveform: "Direction-of-arrival sweep with mainbeam rotation",
    dutyCycle: "34%",
    signature:
      "Cyclic angular scan with periodic returns matching a rotating radar mainbeam profile.",
  },
  {
    id: "multi-emitter",
    name: "Multi-Emitter Composite",
    band: "L / C / X-band",
    waveform: "Mixed agile + periodic + rotating signatures",
    dutyCycle: "41%",
    signature:
      "Dense cluster of radar signatures used to stress AI discrimination and tracking performance.",
  },
];

export const referenceDatasets = [
  {
    id: "cognitive-radio-spectrum",
    name: "Cognitive Radio Spectrum Sensing Dataset",
    provider: "Kaggle",
    focus: "Cognitive radio / spectrum sensing",
    url: "https://www.kaggle.com/datasets/ajithdari/cognitive-radio-spectrum-sensing-dataset",
    summary:
      "Realistic spectrum occupancy and signal activity patterns for spectrum awareness and adaptive sensing workflows.",
  },
  {
    id: "wisig-rf-fingerprinting",
    name: "WiSig RF Fingerprinting Dataset",
    provider: "Kaggle",
    focus: "RF fingerprinting / device identity",
    url: "https://www.kaggle.com/datasets/jeffhei1206/wisig-rf-fingerprinting-dataset",
    summary:
      "Wireless signal fingerprints used to model transmitter discrimination and classification under varying channel conditions.",
  },
  {
    id: "radchar-icassp-2023",
    name: "RadChar ICASSP 2023",
    provider: "Kaggle",
    focus: "Radar characterization / modulation analysis",
    url: "https://www.kaggle.com/datasets/abcxyzi/radchar-icassp-2023",
    summary:
      "Radar characterization signatures for waveform, duty-cycle, and beam-structure comparisons in EW benchmarking.",
  },
  {
    id: "deepsig-catalog",
    name: "DeepSig Dataset Catalog",
    provider: "DeepSig",
    focus: "Communications / RF ML datasets",
    url: "https://www.deepsig.ai/datasets/",
    summary:
      "Open signal datasets used to benchmark modulation recognition, channel estimation, and RF learning tasks.",
  },
  {
    id: "turing-radar-synthetic",
    name: "Turing Synthetic Radar Dataset",
    provider: "Hugging Face",
    focus: "Synthetic radar / surveillance simulation",
    url: "https://huggingface.co/datasets/alan-turing-institute/turing-synthetic-radar-dataset",
    summary:
      "Synthetic radar scenes designed to represent complex surveillance environments and simulated emitter behavior.",
  },
];

export const getRadCharProfile = (id) =>
  radcharProfiles.find((profile) => profile.id === id) ?? radcharProfiles[0];

export const radcharSource = {
  title: "RadChar",
  subtitle: "Radar Characterisation Dataset",
  url: "https://doi.org/10.17862/cranfield.rd.17006214.v1",
  description:
    "Synthetic radar characterization profiles used to model spectral occupancy, modulation, and beam behavior for realistic EW benchmarking.",
};
