from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

def generate_visualizations(user_stats_df, question_stats_df):
    script_dir = Path(__file__).parent

    # 1. Bar Plot: Average Accuracy per Condition
    conditions = ['BASELINE', 'OPTIMAL', 'RANDOM']
    accuracies = [
        user_stats_df['BASELINE_ACCURACY'].mean(),
        user_stats_df['OPTIMAL_ACCURACY'].mean(),
        user_stats_df['RANDOM_ACCURACY'].mean()
    ]
    plt.figure(figsize=(6, 4))
    sns.barplot(x=conditions, y=accuracies, palette="Blues")
    plt.ylim(0, 1)
    plt.title("AVERAGE ACCURACY PER CONDITION")
    plt.ylabel("ACCURACY")
    plt.xlabel("CONDITION")
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
        data_for_plot['CONDITION'].extend([cond_name]*3)
        data_for_plot['CONFIDENCETYPE'].extend(['CORRECT ONLY', 'ALL', 'PENALIZED'])
        data_for_plot['VALUE'].extend([
            user_stats_df[f'{prefix}_AVG_CONF_CORRECT'].mean(),
            user_stats_df[f'{prefix}_AVG_CONF_ALL'].mean(),
            user_stats_df[f'{prefix}_AVG_CONF_PENALIZED'].mean()
        ])
    for condition in ['BASELINE', 'OPTIMAL', 'RANDOM']:
        add_confidence_row(condition, condition)
    conf_df = pd.DataFrame(data_for_plot)
    plt.figure(figsize=(8, 5))
    sns.barplot(data=conf_df, x="CONDITION", y="VALUE", hue="CONFIDENCETYPE", palette="Set2")
    plt.axhline(0, color='black', linewidth=0.8)
    plt.title("AVERAGE CONFIDENCE PER CONDITION")
    plt.ylabel("CONFIDENCE")
    plt.xlabel("CONDITION")
    plt.legend(title="CONFIDENCE STAT", loc="best")
    plt.tight_layout()
    plt.savefig(script_dir / "bar_confidence_per_condition.png")
    plt.close()

    # 4. Dual-Axis Line Plots for Each Condition
    def plot_accuracy_confidence_dual_axis(condition_prefix, output_filename, title):
        acc_col = f'{condition_prefix}_ACCURACY'
        conf_col = f'{condition_prefix}_CONFIDENCE'
        sub_df = question_stats_df[['Q_INDEX', acc_col, conf_col]].dropna()
        fig, ax1 = plt.subplots(figsize=(8, 4))
        ax2 = ax1.twinx()
        ax1.plot(sub_df['Q_INDEX'], sub_df[acc_col], color='blue', marker='o', label='ACCURACY')
        ax2.plot(sub_df['Q_INDEX'], sub_df[conf_col], color='orange', marker='s', label='CONFIDENCE')
        ax1.set_xlabel('Q_INDEX')
        ax1.set_ylabel('ACCURACY', color='blue')
        ax2.set_ylabel('CONFIDENCE', color='orange')
        ax1.tick_params(axis='y', labelcolor='blue')
        ax2.tick_params(axis='y', labelcolor='orange')
        ax1.set_ylim(0, 1.05)
        ax2.set_ylim(0, 6.1)
        plt.title(title)
        fig.tight_layout()
        plt.savefig(script_dir / output_filename)
        plt.close()
    plot_accuracy_confidence_dual_axis('BASELINE', 'line_baseline_accuracy_confidence.png', 'BASELINE: ACCURACY & CONFIDENCE')
    plot_accuracy_confidence_dual_axis('OPTIMAL', 'line_optimal_accuracy_confidence.png', 'OPTIMAL: ACCURACY & CONFIDENCE')
    plot_accuracy_confidence_dual_axis('RANDOM', 'line_random_accuracy_confidence.png', 'RANDOM: ACCURACY & CONFIDENCE')