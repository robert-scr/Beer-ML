#!/usr/bin/env python3
"""
Beer Rating Prediction using Random Forest

This script trains a Random Forest regressor to predict beer ratings
based on user taste preferences and demographics.
"""

import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import LabelEncoder
import os
import joblib
from datetime import datetime

def load_data():
    """Load the CSV data"""
    csv_path = os.path.join(os.path.dirname(__file__), 'beer_ratings_export_20250807_141658.csv')
    df = pd.read_csv(csv_path)
    
    return df

def prepare_features(df):
    """Prepare features and target variable"""
    # Convert 'rating' to numeric, coerce errors to NaN
    columns = ['id', 'user_id', 'beer_name', 'rating', 'age', 'gender', 'latitude',
       'longitude', 'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
       'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
       'barbecue_ketchup', 'tropical_winter', 'early_night', 'beer_frequency',
       'drinks_alcohol', 'submitted_at']
    
    
    # disregard 'id', 'user_id', and 'submitted_at' for model training
    df.drop(columns=['id','submitted_at'], inplace=True)
    
    # First, get the user-level data (demographics and preferences - constant per user)
    user_data = df.groupby('user_id')[['age', 'gender', 'latitude', 'longitude', 
                                       'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
                                       'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
                                       'barbecue_ketchup', 'tropical_winter', 'early_night', 
                                       'beer_frequency', 'drinks_alcohol']].first()
    
    # Then pivot the beer ratings
    beer_ratings = df.pivot_table(index='user_id', columns='beer_name', values='rating', aggfunc='first')
    
    # Combine user data with beer ratings
    df = user_data.join(beer_ratings).reset_index()

    # separate between people that drink alcohol and those who don't
    df_alc = df[df['drinks_alcohol'] == 1]
    df_alc.reset_index(drop=True, inplace=True)
    df_noalc = df[df['drinks_alcohol'] == 0]
    df_noalc.reset_index(drop=True, inplace=True)
    df_alc.drop(columns=['drinks_alcohol', 'Beer A', 'Beer B', 'Beer C',
       'Beer D', 'Beer E', 'Beer F', 'Beer G', 'Beer H', 'Beer I'], inplace=True)
    df_noalc.drop(columns=['drinks_alcohol', 'Beer 1', 'Beer 2', 'Beer 3', 'Beer 4', 'Beer 5',
       'Beer 6', 'Beer 7', 'Beer 8', 'Beer 9'], inplace=True)

    # for all the ratings, replace NAN with the average rating of the beer for numerical features
    # Get the beer columns that are left in df_noalc
    beer_cols_noalc = [col for col in df_noalc.columns if col.startswith('Beer')]
    for col in beer_cols_noalc:
        df_noalc[col] = df_noalc[col].fillna(df_noalc[col].mean())
    
    beer_cols_alc = [col for col in df_alc.columns if col.startswith('Beer')]
    for col in beer_cols_alc:
        df_alc[col] = df_alc[col].fillna(df_alc[col].mean())

    # Encode categorical variables
    le_gender = LabelEncoder()
    le_beer_freq = LabelEncoder()
    
    # Combine both datasets temporarily to fit encoders on all possible values
    all_data = pd.concat([df_alc, df_noalc])
    le_gender.fit(all_data['gender'])
    le_beer_freq.fit(all_data['beer_frequency'])
    
    # Apply encoding to both datasets
    df_alc['gender'] = le_gender.transform(df_alc['gender'])
    df_alc['beer_frequency'] = le_beer_freq.transform(df_alc['beer_frequency'])
    df_noalc['gender'] = le_gender.transform(df_noalc['gender'])
    df_noalc['beer_frequency'] = le_beer_freq.transform(df_noalc['beer_frequency'])

    X_alc = df_alc[['age', 'gender', 'latitude', 'longitude',
       'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
       'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
       'barbecue_ketchup', 'tropical_winter', 'early_night', 'beer_frequency']]
    y_alc = df_alc[beer_cols_alc]

    X_noalc = df_noalc[['age', 'gender', 'latitude', 'longitude',
       'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
       'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
       'barbecue_ketchup', 'tropical_winter', 'early_night', 'beer_frequency']]
    y_noalc = df_noalc[beer_cols_noalc]

    return X_alc, y_alc, X_noalc, y_noalc

def main():
    """Main function"""
    # Load data
    df = load_data()
    
    # Prepare features
    X_alc, y_alc, X_noalc, y_noalc = prepare_features(df)

    print("🍺 Training XGBoost Models for Beer Rating Prediction")
    print("=" * 60)
    
    # Train XGBoost model for alcohol drinkers (Beer A-I)
    print(f"\n🍻 Training model for alcohol drinkers...")
    print(f"   Features: {X_alc.shape[1]} | Users: {X_alc.shape[0]} | Beers: {y_alc.shape[1]}")
    
    xgb_alc = XGBRegressor(
        n_estimators=100,
        max_depth=6,
        random_state=42,
        n_jobs=-1,
        verbosity=0
    )
    xgb_alc.fit(X_alc, y_alc)
    
    # Evaluate alcohol model
    y_pred_alc = xgb_alc.predict(X_alc)
    r2_alc = r2_score(y_alc, y_pred_alc, multioutput='uniform_average')
    mae_alc = mean_absolute_error(y_alc, y_pred_alc, multioutput='uniform_average')
    
    print(f"   ✅ Alcohol model trained | R²: {r2_alc:.4f} | MAE: {mae_alc:.4f}")
    
    # Train XGBoost model for non-alcohol drinkers (Beer 1-9)
    print(f"\n🚫 Training model for non-alcohol drinkers...")
    print(f"   Features: {X_noalc.shape[1]} | Users: {X_noalc.shape[0]} | Beers: {y_noalc.shape[1]}")
    
    xgb_noalc = XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1,
        verbosity=0
    )
    xgb_noalc.fit(X_noalc, y_noalc)
    
    # Evaluate non-alcohol model
    y_pred_noalc = xgb_noalc.predict(X_noalc)
    r2_noalc = r2_score(y_noalc, y_pred_noalc, multioutput='uniform_average')
    mae_noalc = mean_absolute_error(y_noalc, y_pred_noalc, multioutput='uniform_average')
    
    print(f"   ✅ Non-alcohol model trained | R²: {r2_noalc:.4f} | MAE: {mae_noalc:.4f}")
    
    # Feature importance analysis
    print(f"\n🔍 Feature Importance Analysis:")
    feature_names = X_alc.columns.tolist()
    
    # Alcohol model feature importance
    print(f"\n🍻 Alcohol Model - Top Features:")
    importance_alc = xgb_alc.feature_importances_
    feature_importance_alc = list(zip(feature_names, importance_alc))
    feature_importance_alc.sort(key=lambda x: x[1], reverse=True)
    
    for i, (feature, importance) in enumerate(feature_importance_alc, 1):
        print(f"   {i}. {feature:<20} {importance:.4f}")
    
    # Non-alcohol model feature importance
    print(f"\n🚫 Non-Alcohol Model - Top Features:")
    importance_noalc = xgb_noalc.feature_importances_
    feature_importance_noalc = list(zip(feature_names, importance_noalc))
    feature_importance_noalc.sort(key=lambda x: x[1], reverse=True)
    
    for i, (feature, importance) in enumerate(feature_importance_noalc, 1):
        print(f"   {i}. {feature:<20} {importance:.4f}")
    
    # Save models
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    # Save alcohol model
    alc_model_path = os.path.join(model_dir, f'xgb_alcohol_model_{timestamp}.joblib')
    joblib.dump({
        'model': xgb_alc,
        'feature_names': feature_names,
        'target_names': y_alc.columns.tolist(),
        'model_type': 'alcohol_drinkers',
        'timestamp': timestamp
    }, alc_model_path)
    
    # Save non-alcohol model
    noalc_model_path = os.path.join(model_dir, f'xgb_nonalcohol_model_{timestamp}.joblib')
    joblib.dump({
        'model': xgb_noalc,
        'feature_names': feature_names,
        'target_names': y_noalc.columns.tolist(),
        'model_type': 'non_alcohol_drinkers',
        'timestamp': timestamp
    }, noalc_model_path)
    
    print(f"\n💾 Models saved:")
    print(f"   Alcohol model: {os.path.basename(alc_model_path)}")
    print(f"   Non-alcohol model: {os.path.basename(noalc_model_path)}")
    
    print(f"\n✅ XGBoost training completed!")
    print(f"🎯 Models can predict beer ratings based on user preferences and demographics")

if __name__ == "__main__":
    main()
