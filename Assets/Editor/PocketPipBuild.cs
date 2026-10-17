using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

// Builds the Quest APK to Builds/PocketPip.apk.
// Menu: Pocket Pip > Build Quest APK, or batch mode -executeMethod PocketPipBuild.BuildApk
public static class PocketPipBuild
{
    [MenuItem("Pocket Pip/Build Quest APK")]
    public static void BuildApk()
    {
        var options = new BuildPlayerOptions
        {
            scenes = EditorBuildSettings.scenes.Where(s => s.enabled).Select(s => s.path).ToArray(),
            locationPathName = "Builds/PocketPip.apk",
            target = BuildTarget.Android,
            targetGroup = BuildTargetGroup.Android,
            options = BuildOptions.None,
        };
        var report = BuildPipeline.BuildPlayer(options);
        Debug.Log($"[PocketPip] Build {report.summary.result}: {report.summary.outputPath} ({report.summary.totalSize / (1024 * 1024)} MB, {report.summary.totalErrors} errors)");
        if (Application.isBatchMode && report.summary.result != BuildResult.Succeeded)
            EditorApplication.Exit(1);
    }
}
