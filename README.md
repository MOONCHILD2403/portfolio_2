# Seq2Seq Crypto Forecasting

This project trains a sequence-to-sequence LSTM on minute bars using:

- Inputs: `Close`, `Volume`, `volatility`
- Context window: `60`
- Forecast horizon: `15`
- Target: future returns relative to the latest observed close

## Why this version is stronger

- Fits the scaler on the training split only, which avoids validation leakage.
- Uses a chronological split with a temporal gap, which reduces overlap contamination between train and validation windows.
- Predicts normalized future returns instead of absolute prices, which is easier for the model to learn across price regimes.
- Uses Monte Carlo dropout at inference for a more meaningful uncertainty estimate than plain forecast-path standard deviation.

## Train

```bash
python train_seq2seq.py train --csv btcusd_1-min_data.csv --save-path checkpoint.pth --epochs 10 --batch-size 64
```

## Predict

```bash
python train_seq2seq.py predict --csv btcusd_1-min_data.csv --checkpoint checkpoint.pth
```

## Expected interpretation

- `Val Loss` should move closer to train loss than in the original prototype.
- `DA` must beat `0.50` consistently before treating outputs as actionable.
- `Confidence: NOISY` means the model is unstable under dropout perturbations and should be filtered out.
