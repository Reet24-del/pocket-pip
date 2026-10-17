using System.IO;
using PocketPip;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// Builds the greybox palm-bridge test: an attic floor with a gap, Pip on one side,
// a goal on the other, passthrough, and hand tracking. Point to send Pip, hold a flat
// palm across the gap to let Pip cross.
// Menu: Pocket Pip > Build Palm Bridge Prototype, or batch mode
// -executeMethod PrototypeSceneBuilder.Build
public static class PrototypeSceneBuilder
{
    const string ScenePath = "Assets/Scenes/PalmBridgePrototype.unity";
    const string MaterialDir = "Assets/Prototype/Materials";
    const string CoreDir = "Packages/com.meta.xr.sdk.core/Prefabs/";

    const float Gap = 0.12f;
    const float FloorWidth = 0.2f;
    const float FloorDepth = 0.18f;
    const float FloorThickness = 0.02f;

    [MenuItem("Pocket Pip/Build Palm Bridge Prototype")]
    public static void Build()
    {
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

        var wood = Mat("Wood", new Color(0.72f, 0.55f, 0.38f));
        var wall = Mat("Wall", new Color(0.93f, 0.88f, 0.8f));
        var pit = Mat("Pit", new Color(0.08f, 0.06f, 0.06f));
        var pipMat = Mat("Pip", new Color(1f, 0.55f, 0.25f));
        var eye = Mat("Eye", Color.black);
        var goalMat = Mat("Goal", new Color(1f, 0.85f, 0.2f));
        var markerMat = Mat("Marker", new Color(0.2f, 0.9f, 1f));
        var plankMat = Mat("PalmPlank", new Color(0.3f, 1f, 0.55f));

        var light = new GameObject("Directional Light").AddComponent<Light>();
        light.type = LightType.Directional;
        light.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

        // Camera rig with passthrough.
        var rig = (GameObject)PrefabUtility.InstantiatePrefab(AssetDatabase.LoadAssetAtPath<GameObject>(CoreDir + "OVRCameraRig.prefab"));
        var manager = rig.GetComponent<OVRManager>();
        if (manager == null) manager = rig.AddComponent<OVRManager>();
        manager.trackingOriginType = OVRManager.TrackingOrigin.FloorLevel;
        manager.isInsightPassthroughEnabled = true;
        rig.AddComponent<OVRPassthroughLayer>();

        var centerEye = rig.transform.Find("TrackingSpace/CenterEyeAnchor");
        var cam = centerEye.GetComponent<Camera>();
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color(0f, 0f, 0f, 0f);
        cam.nearClipPlane = 0.01f;

        var leftHand = AddHand(rig.transform.Find("TrackingSpace/LeftHandAnchor"), true);
        var rightHand = AddHand(rig.transform.Find("TrackingSpace/RightHandAnchor"), false);

        // Greybox attic.
        var house = new GameObject("Dollhouse");
        house.AddComponent<DollhousePlacer>().head = centerEye;

        float floorX = Gap * 0.5f + FloorWidth * 0.5f;
        Box("FloorLeft", house.transform, new Vector3(-floorX, -FloorThickness * 0.5f, 0f), new Vector3(FloorWidth, FloorThickness, FloorDepth), wood, walkable: true);
        Box("FloorRight", house.transform, new Vector3(floorX, -FloorThickness * 0.5f, 0f), new Vector3(FloorWidth, FloorThickness, FloorDepth), wood, walkable: true);
        Box("Pit", house.transform, new Vector3(0f, -0.07f, 0f), new Vector3(Gap, 0.1f, FloorDepth), pit, walkable: false, collider: false);

        float width = Gap + FloorWidth * 2f;
        Box("BackWall", house.transform, new Vector3(0f, 0.07f, FloorDepth * 0.5f + 0.005f), new Vector3(width, 0.18f, 0.01f), wall, walkable: false);
        Box("WallLeft", house.transform, new Vector3(-width * 0.5f - 0.005f, 0.07f, 0f), new Vector3(0.01f, 0.18f, FloorDepth), wall, walkable: false);
        Box("WallRight", house.transform, new Vector3(width * 0.5f + 0.005f, 0.07f, 0f), new Vector3(0.01f, 0.18f, FloorDepth), wall, walkable: false);

        // Pip: a placeholder capsule with eyes so you can see where they face.
        var pipGo = new GameObject("Pip");
        pipGo.transform.SetParent(house.transform, false);
        pipGo.transform.localPosition = new Vector3(-floorX - 0.05f, 0f, 0f);
        pipGo.transform.localRotation = Quaternion.Euler(0f, 90f, 0f);
        var body = new GameObject("Body").transform;
        body.SetParent(pipGo.transform, false);
        var capsule = Primitive(PrimitiveType.Capsule, "Capsule", body, new Vector3(0f, 0.02f, 0f), new Vector3(0.022f, 0.02f, 0.022f), pipMat);
        Primitive(PrimitiveType.Sphere, "EyeL", body, new Vector3(-0.005f, 0.032f, 0.01f), Vector3.one * 0.005f, eye);
        Primitive(PrimitiveType.Sphere, "EyeR", body, new Vector3(0.005f, 0.032f, 0.01f), Vector3.one * 0.005f, eye);
        var pip = pipGo.AddComponent<PipController>();
        pip.body = body;

        var goal = Primitive(PrimitiveType.Cylinder, "Goal", house.transform, new Vector3(floorX + 0.05f, 0.001f, 0f), new Vector3(0.05f, 0.001f, 0.05f), goalMat);
        var goalZone = goal.gameObject.AddComponent<GoalZone>();
        goalZone.pip = pip;

        var marker = Primitive(PrimitiveType.Cylinder, "PointMarker", null, Vector3.zero, new Vector3(0.02f, 0.0005f, 0.02f), markerMat);
        var markerRoot = new GameObject("PointMarkerRoot").transform;
        marker.SetParent(markerRoot, false);
        markerRoot.gameObject.SetActive(false);

        // Hand logic.
        var logic = new GameObject("HandLogic");
        var leftPose = AddPose(logic, leftHand, true);
        var rightPose = AddPose(logic, rightHand, false);
        foreach (var p in new[] { leftPose, rightPose })
        {
            var bridge = logic.AddComponent<PalmBridge>();
            bridge.pose = p;
            bridge.plankMaterial = plankMat;
        }
        var point = logic.AddComponent<PointToMove>();
        point.hands = new[] { leftPose, rightPose };
        point.pip = pip;
        point.marker = markerRoot;

        Directory.CreateDirectory(Path.GetDirectoryName(ScenePath));
        EditorSceneManager.SaveScene(scene, ScenePath);
        EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
        AssetDatabase.SaveAssets();
        Debug.Log("[PocketPip] Built " + ScenePath);
    }

    static GameObject AddHand(Transform anchor, bool left)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(AssetDatabase.LoadAssetAtPath<GameObject>(CoreDir + "OVRHandPrefab.prefab"), anchor);
        go.name = left ? "LeftHand" : "RightHand";
        SetEnum(go.GetComponent<OVRHand>(), "HandType", (int)(left ? OVRHand.Hand.HandLeft : OVRHand.Hand.HandRight));
        SetEnum(go.GetComponent<OVRSkeleton>(), "_skeletonType", (int)(left ? OVRSkeleton.SkeletonType.XRHandLeft : OVRSkeleton.SkeletonType.XRHandRight));
        SetEnum(go.GetComponent<OVRMesh>(), "_meshType", (int)(left ? OVRMesh.MeshType.XRHandLeft : OVRMesh.MeshType.XRHandRight));
        return go;
    }

    static HandPose AddPose(GameObject host, GameObject handGo, bool left)
    {
        var pose = host.AddComponent<HandPose>();
        pose.hand = handGo.GetComponent<OVRHand>();
        pose.skeleton = handGo.GetComponent<OVRSkeleton>();
        pose.isLeft = left;
        return pose;
    }

    static void SetEnum(Object target, string field, int value)
    {
        if (target == null) { Debug.LogWarning("[PocketPip] Missing component for " + field); return; }
        var so = new SerializedObject(target);
        var prop = so.FindProperty(field);
        if (prop == null) { Debug.LogWarning("[PocketPip] Field not found: " + field); return; }
        prop.intValue = value;
        so.ApplyModifiedPropertiesWithoutUndo();
        PrefabUtility.RecordPrefabInstancePropertyModifications(target);
        so.Update();
        Debug.Log($"[PocketPip] {target.name}.{field} = {so.FindProperty(field).intValue}");
    }

    static Transform Box(string name, Transform parent, Vector3 pos, Vector3 size, Material mat, bool walkable, bool collider = true)
    {
        var t = Primitive(PrimitiveType.Cube, name, parent, pos, size, mat, collider);
        if (walkable) t.gameObject.AddComponent<Walkable>();
        return t;
    }

    static Transform Primitive(PrimitiveType type, string name, Transform parent, Vector3 pos, Vector3 scale, Material mat, bool collider = false)
    {
        var go = GameObject.CreatePrimitive(type);
        go.name = name;
        if (!collider) Object.DestroyImmediate(go.GetComponent<Collider>());
        go.transform.SetParent(parent, false);
        go.transform.localPosition = pos;
        go.transform.localScale = scale;
        go.GetComponent<Renderer>().sharedMaterial = mat;
        return go.transform;
    }

    static Material Mat(string name, Color color)
    {
        Directory.CreateDirectory(MaterialDir);
        string path = MaterialDir + "/" + name + ".mat";
        var mat = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (mat == null)
        {
            mat = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            AssetDatabase.CreateAsset(mat, path);
        }
        mat.SetColor("_BaseColor", color);
        EditorUtility.SetDirty(mat);
        return mat;
    }
}
