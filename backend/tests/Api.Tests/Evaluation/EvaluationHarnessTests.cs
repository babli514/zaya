namespace Api.Tests.Evaluation;

public class EvaluationHarnessTests
{
    [Fact]
    public async Task EvaluationHarness_Generates_Results_And_Summary()
    {
        var output = await EvaluationHarnessRunner.RunAsync();

        Assert.NotNull(output);
        Assert.NotNull(output.Results);
        Assert.NotNull(output.Summary);

        var options = EvaluationHarnessRunner.BuildDefaultOptions();
        Assert.True(File.Exists(options.ResultsJsonPath));
        Assert.True(File.Exists(options.SummaryCsvPath));
        Assert.All(output.Results, row => Assert.False(string.IsNullOrWhiteSpace(row.Provider)));
    }
}
