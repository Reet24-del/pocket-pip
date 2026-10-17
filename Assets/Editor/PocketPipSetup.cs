using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.XR.Management;
using UnityEditor.XR.Management.Metadata;
using UnityEngine;
using UnityEngine.XR.Management;

// One-time project configuration for Quest: Android/IL2CPP/ARM64, Oculus XR loader,
// hands-only tracking, passthrough and scene support for mixed reality.
// Run from the menu (Pocket Pip > Configure For Quest) or in batch mode with
// -executeMethod PocketPipSetup.Configure
public static class PocketPipSetup
{
    const string XrSettingsPath = "Assets/XR/XRGeneralSettingsPerBuildTarget.asset";

    [MenuItem("Pocket Pip/Configure For Quest")]
    public static void Configure()
    {
        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android);

        PlayerSettings.SetScriptingBackend(NamedBuildTarget.Android, ScriptingImplementation.IL2CPP);
        PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
        PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel32;
        PlayerSettings.colorSpace = ColorSpace.Linear;

        ConfigureXrLoader();
        ConfigureMetaFeatures();

        AssetDatabase.SaveAssets();
        Debug.Log("[PocketPip] Quest configuration complete.");
    }

    static void ConfigureXrLoader()
    {
        EditorBuildSettings.TryGetConfigObject(XRGeneralSettings.k_SettingsKey, out XRGeneralSettingsPerBuildTarget perTarget);
        if (perTarget == null)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(XrSettingsPath));
            perTarget = ScriptableObject.CreateInstance<XRGeneralSettingsPerBuildTarget>();
            AssetDatabase.CreateAsset(perTarget, XrSettingsPath);
            EditorBuildSettings.AddConfigObject(XRGeneralSettings.k_SettingsKey, perTarget, true);
        }

        if (!perTarget.HasSettingsForBuildTarget(BuildTargetGroup.Android))
            perTarget.CreateDefaultSettingsForBuildTarget(BuildTargetGroup.Android);
        if (!perTarget.HasManagerSettingsForBuildTarget(BuildTargetGroup.Android))
            perTarget.CreateDefaultManagerSettingsForBuildTarget(BuildTargetGroup.Android);

        var settings = perTarget.SettingsForBuildTarget(BuildTargetGroup.Android);
        settings.InitManagerOnStart = true;
        XRPackageMetadataStore.AssignLoader(settings.Manager, "Unity.XR.Oculus.OculusLoader", BuildTargetGroup.Android);
        EditorUtility.SetDirty(perTarget);
    }

    static void ConfigureMetaFeatures()
    {
        var config = OVRProjectConfig.CachedProjectConfig;
        config.handTrackingSupport = OVRProjectConfig.HandTrackingSupport.HandsOnly;
        config.insightPassthroughSupport = OVRProjectConfig.FeatureSupport.Supported;
        config.sceneSupport = OVRProjectConfig.FeatureSupport.Supported;
        config.anchorSupport = OVRProjectConfig.AnchorSupport.Enabled;
        OVRProjectConfig.CommitProjectConfig(config);
    }
}
