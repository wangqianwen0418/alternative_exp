from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

def generate_visualizations(user_stats_df, question_stats_df):
    script_dir = Path(__file__).parent

    # 1. Bar Plot: Average Accuracy per Condition
    conditions = ['BASELINE', 'OPTIMAL', 'RANDOM']
    avg_accuracy_df = pd.DataFrame({
        'CONDITION': ['BASELINE', 'OPTIMAL', 'RANDOM'],
        'ACCURACY': [
            user_stats_df['BASELINE_ACCURACY'].mean(),
            user_stats_df['OPTIMAL_ACCURACY'].mean(),
            user_stats_df['RANDOM_ACCURACY'].mean()
        ]
    })
    plt.figure(figsize=(6, 4))
    sns.barplot(data=avg_accuracy_df, x='CONDITION', y='ACCURACY', hue='CONDITION', palette='Blues', legend=False)
    plt.ylim(0, 1)
    plt.title("AVERAGE ACCURACY PER CONDITION")
    plt.ylabel("ACCURACY")
    plt.xlabel("CONDITION")

    accuracy_stds = [
        user_stats_df['BASELINE_ACCURACY'].std(ddof=1),
        user_stats_df['OPTIMAL_ACCURACY'].std(ddof=1),
        user_stats_df['RANDOM_ACCURACY'].std(ddof=1)
    ]
    ax = plt.gca()
    for i, bar in enumerate(ax.patches):
        x = bar.get_x() + bar.get_width() / 2
        y = bar.get_height()
        plt.errorbar(x, y, yerr=accuracy_stds[i], ecolor='black', capsize=5, fmt='none')

    plt.tight_layout()
    plt.savefig(script_dir / "bar_accuracy_per_condition.png")
    plt.close()

    # 2. Bar Plot: Confidence Stats
    data_for_plot = {
        'CONDITION': [],
        'CONFIDENCETYPE': [],
        'VALUE': []
    }

    def add_confidence_row(cond_name, prefix):
        data_for_plot['CONDITION'].extend([cond_name] * 3)
        data_for_plot['CONFIDENCETYPE'].extend(['CORRECT ONLY', 'INCORRECT ONLY', 'ALL'])
        data_for_plot['VALUE'].extend([
            user_stats_df[f'{prefix}_AVG_CONF_CORRECT'].mean(),
            user_stats_df[f'{prefix}_AVG_CONF_INCORRECT'].mean(),
            user_stats_df[f'{prefix}_AVG_CONF_ALL'].mean(),
        ])

    for condition in conditions:
        add_confidence_row(condition, condition)

    conf_df = pd.DataFrame(data_for_plot)
    plt.figure(figsize=(8, 5))
    sns.barplot(data=conf_df, x="CONDITION", y="VALUE", hue="CONFIDENCETYPE", palette="Set2")
    plt.axhline(0, color='black', linewidth=0.8)
    plt.title("AVERAGE CONFIDENCE PER CONDITION")
    plt.ylabel("CONFIDENCE")
    plt.xlabel("CONDITION")
    plt.legend(title="CONFIDENCE STAT", loc="center left", bbox_to_anchor=(1.02, 0.5), borderaxespad=0)

    stds_conf = []
    for condition in conditions:
        stds_conf.append(user_stats_df[f'{condition}_AVG_CONF_CORRECT_STD'].mean())
        stds_conf.append(user_stats_df[f'{condition}_AVG_CONF_INCORRECT_STD'].mean())
        stds_conf.append(user_stats_df[f'{condition}_AVG_CONF_ALL_STD'].mean())

    ax = plt.gca()
    for i, bar in enumerate(ax.patches):
        if i < len(stds_conf):
            x = bar.get_x() + bar.get_width() / 2
            y = bar.get_height()
            plt.errorbar(x, y, yerr=stds_conf[i], ecolor='black', capsize=5, fmt='none')

    plt.tight_layout()
    plt.savefig(script_dir / "bar_confidence_per_condition.png")
    plt.close()

    def melt_question_stats(df, value_col_suffix, std_col_suffix):
        melted_data = []
        for _, row in df.iterrows():
            q_index = row['Q_INDEX']
            for condition in ['BASELINE', 'OPTIMAL', 'RANDOM']:
                melted_data.append({
                    'Q_INDEX': int(q_index),
                    'CONDITION': condition,
                    'VALUE': row[f'{condition}_{value_col_suffix}'],
                    'STD': row.get(f'{condition}_{std_col_suffix}', 0)
                })
        return pd.DataFrame(melted_data).dropna(subset=['VALUE'])

    def plot_bars_with_error(df, x, y, hue, title, ylabel, filename, palette, ylim):
        plt.figure(figsize=(10, 6))
        ax = sns.barplot(data=df, x=x, y=y, hue=hue, palette=palette, errorbar=None)
        plt.ylim(*ylim)
        plt.title(title)
        plt.ylabel(ylabel)
        plt.xlabel(x)

        for bar, (_, row) in zip(ax.patches, df.iterrows()):
            x_center = bar.get_x() + bar.get_width() / 2
            y_height = bar.get_height()
            std = row['STD'] if pd.notnull(row['STD']) else 0.0
            plt.errorbar(x_center, y_height, yerr=std, ecolor='black', capsize=4, fmt='none')

        plt.legend(title="CONDITION", loc="center left", bbox_to_anchor=(1.02, 0.5), borderaxespad=0)
        plt.tight_layout()
        plt.savefig(filename)
        plt.close()

    # 3. Accuracy by Condition per Question
    acc_df = melt_question_stats(question_stats_df, value_col_suffix='ACCURACY', std_col_suffix='ACCURACY_STD')
    acc_df = acc_df.sort_values(by=['Q_INDEX', 'CONDITION'])
    plot_bars_with_error(
        df=acc_df,
        x='Q_INDEX', y='VALUE', hue='CONDITION',
        title="ACCURACY BY CONDITION PER QUESTION",
        ylabel="ACCURACY",
        filename=script_dir / "bar_accuracy_by_question.png",
        palette='Blues',
        ylim=(0, 1.05)
    )

    # 4. Confidence by Condition per Question
    conf_df = melt_question_stats(question_stats_df, value_col_suffix='CONFIDENCE', std_col_suffix='CONFIDENCE_STD')
    conf_df = conf_df.sort_values(by=['Q_INDEX', 'CONDITION'])
    plot_bars_with_error(
        df=conf_df,
        x='Q_INDEX', y='VALUE', hue='CONDITION',
        title="CONFIDENCE BY CONDITION PER QUESTION",
        ylabel="CONFIDENCE",
        filename=script_dir / "bar_confidence_by_question.png",
        palette='Set2',
        ylim=(0, 6.1)
    )

    # 5. Average Duration per Question Part
    durations_df = (
        question_stats_df[['Q_INDEX', 'AVG_A_TIME', 'AVG_B_TIME']]
        .melt(id_vars='Q_INDEX',
              value_vars=['AVG_A_TIME','AVG_B_TIME'],
              var_name='PART', value_name='TIME')
    )
    durations_df['PART'] = durations_df['PART'].map({
        'AVG_A_TIME': 'Part A',
        'AVG_B_TIME': 'Part B'
    })

    plt.figure(figsize=(10, 6))
    ax = sns.barplot(data=durations_df, x='Q_INDEX', y='TIME', hue='PART', errorbar=None)
    plt.title("AVERAGE DURATION PER QUESTION PART")
    plt.ylabel("Time (seconds)")
    plt.xlabel("Question Index")
    plt.legend(title="Part", loc='center left', bbox_to_anchor=(1.02, 0.5), borderaxespad=0)
    plt.tight_layout()
    plt.subplots_adjust(right=0.85)
    plt.savefig(script_dir / "bar_duration_per_question_part.png")
    plt.close()