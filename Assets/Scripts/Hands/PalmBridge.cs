using UnityEngine;

namespace PocketPip
{
    // Turns a flat, palm-up, steady hand into a walkable plank for Pip.
    // The plank follows the hand while active, so Pip can ride a gently moving palm.
    public class PalmBridge : MonoBehaviour
    {
        public HandPose pose;

        [Header("Activation")]
        [Range(0f, 1f)] public float palmUpDot = 0.75f;
        [Tooltip("Hand must be slower than this (m/s) to start a bridge.")]
        public float steadySpeed = 0.06f;
        [Tooltip("Once active, the bridge survives moves up to this speed (m/s).")]
        public float holdSpeed = 0.2f;
        public float activateDelay = 0.25f;
        public float deactivateDelay = 0.15f;

        [Header("Plank")]
        public Vector2 size = new Vector2(0.09f, 0.19f);
        public float thickness = 0.01f;
        [Tooltip("Joint positions sit inside the hand; lift the plank to the palm's skin.")]
        public float surfaceOffset = 0.012f;
        public Material plankMaterial;

        public bool IsActive { get; private set; }

        BoxCollider _collider;
        Renderer _visual;
        float _goodTime, _badTime;

        void Awake()
        {
            var plank = new GameObject("PalmPlank");
            plank.transform.SetParent(transform, false);
            _collider = plank.AddComponent<BoxCollider>();
            _collider.size = new Vector3(size.x, thickness, size.y);
            var walkable = plank.AddComponent<Walkable>();
            walkable.isSolidGround = false;
            walkable.isPointTarget = false;

            var vis = GameObject.CreatePrimitive(PrimitiveType.Cube);
            Destroy(vis.GetComponent<Collider>());
            vis.name = "PlankVisual";
            vis.transform.SetParent(plank.transform, false);
            vis.transform.localScale = new Vector3(size.x, 0.002f, size.y);
            _visual = vis.GetComponent<Renderer>();
            if (plankMaterial != null) _visual.sharedMaterial = plankMaterial;

            SetActive(false);
        }

        void LateUpdate()
        {
            bool tracked = pose != null && pose.IsTracked;
            bool shapeOk = tracked && pose.IsFlat && Vector3.Dot(pose.PalmNormal, Vector3.up) > palmUpDot;
            float speed = tracked ? pose.PalmVelocity.magnitude : 0f;
            bool good = shapeOk && speed < (IsActive ? holdSpeed : steadySpeed);

            if (good) { _goodTime += Time.deltaTime; _badTime = 0f; }
            else { _badTime += Time.deltaTime; _goodTime = 0f; }

            if (!IsActive && _goodTime >= activateDelay) SetActive(true);
            else if (IsActive && _badTime >= deactivateDelay) SetActive(false);

            if (tracked) FollowHand();
        }

        void FollowHand()
        {
            Vector3 up = pose.PalmNormal;
            Vector3 forward = Vector3.ProjectOnPlane(pose.HandForward, up);
            if (forward.sqrMagnitude < 1e-6f) return;

            Vector3 mid = Vector3.Lerp(pose.Wrist, pose.MiddleTip, 0.5f);
            var t = _collider.transform;
            t.SetPositionAndRotation(mid + up * (surfaceOffset + thickness * 0.5f), Quaternion.LookRotation(forward, up));
        }

        void SetActive(bool active)
        {
            IsActive = active;
            _collider.enabled = active;
            _visual.enabled = active;
        }
    }
}
