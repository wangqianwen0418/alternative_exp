import pandas as pd
import numpy as np
from pathlib import Path
from vis_gen import generate_visualizations

def compute_user_stats(df):
    def compute_stats(subset_df, truth_col):
        correct = (subset_df['USER_ANSWER'] == subset_df[truth_col])
        accuracy = correct.mean()

        penalized_values = subset_df['CONFIDENCE'] * np.where(correct, 1, -1)

        avg_conf_correct = subset_df.loc[correct, 'CONFIDENCE'].mean()
        avg_conf_all = subset_df['CONFIDENCE'].mean()
        avg_conf_penalized = penalized_values.mean()

        return pd.Series({
            'ACCURACY': accuracy,
            'AVG_CONF_CORRECT': avg_conf_correct,
            'AVG_CONF_ALL': avg_conf_all,
            'AVG_CONF_PENALIZED': avg_conf_penalized
        })

    user_groups = df.groupby('UUID')
    user_stats_list = []

    for user_id, user_df in user_groups:
        baseline_df = user_df[user_df['SECOND_PART'] == 'NO']
        optimal_df = user_df[(user_df['SECOND_PART'] == 'YES') & (user_df['TEST_CONDITION'] == 'OPTIMAL')]
        random_df = user_df[(user_df['SECOND_PART'] == 'YES') & (user_df['TEST_CONDITION'] == 'RANDOM')]

        baseline_stats = compute_stats(baseline_df, 'FIRST_TRUTH')
        optimal_stats = compute_stats(optimal_df, 'SECOND_TRUTH')
        random_stats = compute_stats(random_df, 'SECOND_TRUTH')

        user_stats_list.append({
            'UUID': user_id,

            'BASELINE_ACCURACY': baseline_stats['ACCURACY'],
            'BASELINE_AVG_CONF_CORRECT': baseline_stats['AVG_CONF_CORRECT'],
            'BASELINE_AVG_CONF_ALL': baseline_stats['AVG_CONF_ALL'],
            'BASELINE_AVG_CONF_PENALIZED': baseline_stats['AVG_CONF_PENALIZED'],

            'OPTIMAL_ACCURACY': optimal_stats['ACCURACY'],
            'OPTIMAL_AVG_CONF_CORRECT': optimal_stats['AVG_CONF_CORRECT'],
            'OPTIMAL_AVG_CONF_ALL': optimal_stats['AVG_CONF_ALL'],
            'OPTIMAL_AVG_CONF_PENALIZED': optimal_stats['AVG_CONF_PENALIZED'],

            'RANDOM_ACCURACY': random_stats['ACCURACY'],
            'RANDOM_AVG_CONF_CORRECT': random_stats['AVG_CONF_CORRECT'],
            'RANDOM_AVG_CONF_ALL': random_stats['AVG_CONF_ALL'],
            'RANDOM_AVG_CONF_PENALIZED': random_stats['AVG_CONF_PENALIZED'],
        })

    user_stats_df = pd.DataFrame(user_stats_list)
    return user_stats_df

def compute_question_stats(df):
    baseline_df = df[df['SECOND_PART'] == 'NO'].copy()
    baseline_df['CORRECT'] = (baseline_df['USER_ANSWER'] == baseline_df['FIRST_TRUTH'])
    baseline_acc = baseline_df.groupby('Q_INDEX')['CORRECT'].mean().rename('BASELINE_ACCURACY')
    baseline_conf = baseline_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('BASELINE_CONFIDENCE')

    optimal_df = df[(df['SECOND_PART'] == 'YES') & (df['TEST_CONDITION'] == 'OPTIMAL')].copy()
    optimal_df['CORRECT'] = (optimal_df['USER_ANSWER'] == optimal_df['SECOND_TRUTH'])
    optimal_acc = optimal_df.groupby('Q_INDEX')['CORRECT'].mean().rename('OPTIMAL_ACCURACY')
    optimal_conf = optimal_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('OPTIMAL_CONFIDENCE')

    random_df = df[(df['SECOND_PART'] == 'YES') & (df['TEST_CONDITION'] == 'RANDOM')].copy()
    random_df['CORRECT'] = (random_df['USER_ANSWER'] == random_df['SECOND_TRUTH'])
    random_acc = random_df.groupby('Q_INDEX')['CORRECT'].mean().rename('RANDOM_ACCURACY')
    random_conf = random_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('RANDOM_CONFIDENCE')

    question_stats = (
        pd.DataFrame()
        .join(baseline_acc, how='outer')
        .join(baseline_conf, how='outer')
        .join(optimal_acc, how='outer')
        .join(optimal_conf, how='outer')
        .join(random_acc, how='outer')
        .join(random_conf, how='outer')
    )

    question_stats.reset_index(inplace=True)
    return question_stats

def main():
    script_dir = Path(__file__).parent
    data_path = script_dir / "study.csv"
    user_path = script_dir / "user_stats.csv"
    question_path = script_dir / "question_stats.csv"

    df = pd.read_csv(data_path)

    user_stats_df = compute_user_stats(df)
    question_stats_df = compute_question_stats(df)

    user_stats_df.to_csv(user_path, index=False)
    question_stats_df.to_csv(question_path, index=False)

    generate_visualizations(user_stats_df, question_stats_df)

if __name__ == "__main__":
    main()
