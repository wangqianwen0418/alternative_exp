import pandas as pd
import numpy as np
from pathlib import Path
from vis_gen import generate_visualizations

def compute_user_stats(df):
    def compute_stats(subset_df, truth_col):
        correct = (subset_df['USER_ANSWER'] == subset_df[truth_col])
        accuracy = correct.mean()

        # penalized_values = subset_df['CONFIDENCE'] * np.where(correct, 1, -1)

        avg_conf_correct = subset_df.loc[correct, 'CONFIDENCE'].mean()
        avg_conf_incorrect = subset_df.loc[~correct, 'CONFIDENCE'].mean()
        avg_conf_all = subset_df['CONFIDENCE'].mean()
        # avg_conf_penalized = penalized_values.mean()

        accuracy_std = correct.std(ddof=1)
        avg_conf_correct_std = subset_df.loc[correct, 'CONFIDENCE'].std(ddof=1)
        avg_conf_incorrect_std = subset_df.loc[~correct, 'CONFIDENCE'].std(ddof=1)
        avg_conf_all_std = subset_df['CONFIDENCE'].std(ddof=1)
        # avg_conf_penalized_std = penalized_values.std(ddof=1)

        return pd.Series({
            'ACCURACY': accuracy,
            'AVG_CONF_CORRECT': avg_conf_correct,
            'AVG_CONF_INCORRECT': avg_conf_incorrect,
            'AVG_CONF_ALL': avg_conf_all,
            # 'AVG_CONF_PENALIZED': avg_conf_penalized,

            'ACCURACY_STD': accuracy_std,
            'AVG_CONF_CORRECT_STD': avg_conf_correct_std,
            'AVG_CONF_INCORRECT_STD': avg_conf_incorrect_std,
            'AVG_CONF_ALL_STD': avg_conf_all_std,
            # 'AVG_CONF_PENALIZED_STD': avg_conf_penalized_std
        })

    user_groups = df.groupby('UUID')
    user_stats_list = []

    for user_id, user_df in user_groups:
        baseline_df = user_df[~user_df['IS_SECOND_PART']]
        optimal_df = user_df[user_df['IS_SECOND_PART'] & (user_df['SECOND_GRAPH_TYPE'] == 'OPTIMAL')]
        random_df = user_df[user_df['IS_SECOND_PART'] & (user_df['SECOND_GRAPH_TYPE'] == 'RANDOM')]


        baseline_stats = compute_stats(baseline_df, 'GROUND_TRUTH')
        optimal_stats = compute_stats(optimal_df, 'GROUND_TRUTH')
        random_stats = compute_stats(random_df, 'GROUND_TRUTH')

        user_stats_list.append({
            'UUID': user_id,

            'BASELINE_ACCURACY': baseline_stats['ACCURACY'],
            'BASELINE_AVG_CONF_CORRECT': baseline_stats['AVG_CONF_CORRECT'],
            'BASELINE_AVG_CONF_INCORRECT': baseline_stats['AVG_CONF_INCORRECT'],
            'BASELINE_AVG_CONF_ALL': baseline_stats['AVG_CONF_ALL'],
            # 'BASELINE_AVG_CONF_PENALIZED': baseline_stats['AVG_CONF_PENALIZED'],

            'OPTIMAL_ACCURACY': optimal_stats['ACCURACY'],
            'OPTIMAL_AVG_CONF_CORRECT': optimal_stats['AVG_CONF_CORRECT'],
            'OPTIMAL_AVG_CONF_INCORRECT': optimal_stats['AVG_CONF_INCORRECT'],
            'OPTIMAL_AVG_CONF_ALL': optimal_stats['AVG_CONF_ALL'],
            # 'OPTIMAL_AVG_CONF_PENALIZED': optimal_stats['AVG_CONF_PENALIZED'],

            'RANDOM_ACCURACY': random_stats['ACCURACY'],
            'RANDOM_AVG_CONF_CORRECT': random_stats['AVG_CONF_CORRECT'],
            'RANDOM_AVG_CONF_INCORRECT': random_stats['AVG_CONF_INCORRECT'],
            'RANDOM_AVG_CONF_ALL': random_stats['AVG_CONF_ALL'],
            # 'RANDOM_AVG_CONF_PENALIZED': random_stats['AVG_CONF_PENALIZED'],

            'BASELINE_ACCURACY_STD': baseline_stats['ACCURACY_STD'],
            'BASELINE_AVG_CONF_CORRECT_STD': baseline_stats['AVG_CONF_CORRECT_STD'],
            'BASELINE_AVG_CONF_INCORRECT_STD': baseline_stats['AVG_CONF_INCORRECT_STD'],
            'BASELINE_AVG_CONF_ALL_STD': baseline_stats['AVG_CONF_ALL_STD'],
            # 'BASELINE_AVG_CONF_PENALIZED_STD': baseline_stats['AVG_CONF_PENALIZED_STD'],

            'OPTIMAL_ACCURACY_STD': optimal_stats['ACCURACY_STD'],
            'OPTIMAL_AVG_CONF_CORRECT_STD': optimal_stats['AVG_CONF_CORRECT_STD'],
            'OPTIMAL_AVG_CONF_INCORRECT_STD': optimal_stats['AVG_CONF_INCORRECT_STD'],
            'OPTIMAL_AVG_CONF_ALL_STD': optimal_stats['AVG_CONF_ALL_STD'],
            # 'OPTIMAL_AVG_CONF_PENALIZED_STD': optimal_stats['AVG_CONF_PENALIZED_STD'],

            'RANDOM_ACCURACY_STD': random_stats['ACCURACY_STD'],
            'RANDOM_AVG_CONF_CORRECT_STD': random_stats['AVG_CONF_CORRECT_STD'],
            'RANDOM_AVG_CONF_INCORRECT_STD': random_stats['AVG_CONF_INCORRECT_STD'],
            'RANDOM_AVG_CONF_ALL_STD': random_stats['AVG_CONF_ALL_STD'],
            # 'RANDOM_AVG_CONF_PENALIZED_STD': random_stats['AVG_CONF_PENALIZED_STD'],
        })

    user_stats_df = pd.DataFrame(user_stats_list)
    return user_stats_df

def compute_question_stats(df):
    baseline_df = df[~df['IS_SECOND_PART']].copy()
    baseline_df['CORRECT'] = (baseline_df['USER_ANSWER'] == baseline_df['GROUND_TRUTH'])
    baseline_acc = baseline_df.groupby('Q_INDEX')['CORRECT'].mean().rename('BASELINE_ACCURACY')
    baseline_conf = baseline_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('BASELINE_CONFIDENCE')

    baseline_acc_std = baseline_df.groupby('Q_INDEX')['CORRECT'].std(ddof=1).rename('BASELINE_ACCURACY_STD')
    baseline_conf_std = baseline_df.groupby('Q_INDEX')['CONFIDENCE'].std(ddof=1).rename('BASELINE_CONFIDENCE_STD')

    optimal_df = df[(df['IS_SECOND_PART']) & (df['SECOND_GRAPH_TYPE'] == 'OPTIMAL')].copy()
    optimal_df['CORRECT'] = (optimal_df['USER_ANSWER'] == optimal_df['GROUND_TRUTH'])
    optimal_acc = optimal_df.groupby('Q_INDEX')['CORRECT'].mean().rename('OPTIMAL_ACCURACY')
    optimal_conf = optimal_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('OPTIMAL_CONFIDENCE')

    optimal_acc_std = optimal_df.groupby('Q_INDEX')['CORRECT'].std(ddof=1).rename('OPTIMAL_ACCURACY_STD')
    optimal_conf_std = optimal_df.groupby('Q_INDEX')['CONFIDENCE'].std(ddof=1).rename('OPTIMAL_CONFIDENCE_STD')

    random_df = df[(df['IS_SECOND_PART']) & (df['SECOND_GRAPH_TYPE'] == 'RANDOM')].copy()
    random_df['CORRECT'] = (random_df['USER_ANSWER'] == random_df['GROUND_TRUTH'])
    random_acc = random_df.groupby('Q_INDEX')['CORRECT'].mean().rename('RANDOM_ACCURACY')
    random_conf = random_df.groupby('Q_INDEX')['CONFIDENCE'].mean().rename('RANDOM_CONFIDENCE')

    random_acc_std = random_df.groupby('Q_INDEX')['CORRECT'].std(ddof=1).rename('RANDOM_ACCURACY_STD')
    random_conf_std = random_df.groupby('Q_INDEX')['CONFIDENCE'].std(ddof=1).rename('RANDOM_CONFIDENCE_STD')

    question_stats = (
        pd.DataFrame()
        .join(baseline_acc, how='outer')
        .join(baseline_conf, how='outer')
        .join(baseline_acc_std, how='outer')
        .join(baseline_conf_std, how='outer')
        .join(optimal_acc, how='outer')
        .join(optimal_conf, how='outer')
        .join(optimal_acc_std, how='outer')
        .join(optimal_conf_std, how='outer')
        .join(random_acc, how='outer')
        .join(random_conf, how='outer')
        .join(random_acc_std, how='outer')
        .join(random_conf_std, how='outer')
    )

    question_stats.reset_index(inplace=True)
    return question_stats

def compute_durations(log: pd.DataFrame) -> pd.DataFrame:
    tmp = log.copy()
    tmp['Q_INDEX'] = (
        tmp['LOG_DESC']
           .str.extract(r'Index:\s*(\d+)', expand=False)
           .astype(float)
    )
    tmp = tmp.dropna(subset=['Q_INDEX']).copy()
    tmp['Q_INDEX'] = tmp['Q_INDEX'].astype(int)

    records = []
    for (uid, q), g in tmp.groupby(['UUID','Q_INDEX'], sort=False):
        try:
            t0 = g.loc[g['LOG_TYPE']=='Question Started', 'TIMESTAMP'].iloc[0]
            tA = g.loc[g['LOG_TYPE']=='Question Part A Finished', 'TIMESTAMP'].iloc[0]
            tB = g.loc[g['LOG_TYPE']=='Question Part B Finished', 'TIMESTAMP'].iloc[0]
        except IndexError:
            continue

        records.append({
            'UUID': uid,
            'Q_INDEX': q,
            'A_TIME': (tA - t0).total_seconds(),
            'B_TIME': (tB - tA).total_seconds()
        })

    return pd.DataFrame.from_records(records)


def main():
    script_dir = Path(__file__).parent
    data_path = script_dir / "study.csv"
    log_path = script_dir / "log.csv"
    user_path = script_dir / "user_stats.csv"
    question_path = script_dir / "question_stats.csv"

    # -------------------------------------------------------------------------

    dropped_questions = []
    render_error_bars = True
    
    # -------------------------------------------------------------------------

    df = pd.read_csv(data_path)
    log_df = pd.read_csv(
        log_path,
        parse_dates=['TIMESTAMP'],
        date_format='%m/%d/%Y, %I:%M:%S %p'
    )
    
    df = df[~df['Q_INDEX'].isin(dropped_questions)].copy()

    duration_stats_df = compute_durations(log_df)

    user_stats_df = compute_user_stats(df)
    question_stats_df = compute_question_stats(df)

    user_avg = (
        duration_stats_df
          .groupby('UUID')[['A_TIME','B_TIME']]
          .mean()
          .reset_index()
          .rename(columns={'A_TIME':'AVG_A_TIME','B_TIME':'AVG_B_TIME'})
    )

    user_total = (
        duration_stats_df
        .groupby('UUID')[['A_TIME', 'B_TIME']]
        .sum()
        .sum(axis=1)
        .to_frame('TOTAL_TIME')
        .reset_index()
    )

    q_avg = (
        duration_stats_df
          .groupby('Q_INDEX')[['A_TIME','B_TIME']]
          .mean()
          .reset_index()
          .rename(columns={'A_TIME':'AVG_A_TIME','B_TIME':'AVG_B_TIME'})
    )

    user_stats_df = (
        user_stats_df
        .merge(user_avg, on='UUID', how='left')
        .merge(user_total, on='UUID', how='left')
    )
    question_stats_df = question_stats_df.merge(q_avg, on='Q_INDEX', how='left')

    user_stats_df.to_csv(user_path, index=False)
    question_stats_df.to_csv(question_path, index=False)
    generate_visualizations(user_stats_df, question_stats_df, render_error_bars)

if __name__ == "__main__":
    main()