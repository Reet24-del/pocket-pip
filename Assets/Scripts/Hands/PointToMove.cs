using UnityEngine;

namespace PocketPip
{
    // Point at a spot inside the house with your index finger, hold briefly, and Pip walks there.
    public class PointToMove : MonoBehaviour
    {
        public HandPose[] hands;
        public PipController pip;
        public Transform marker;
        public float maxDistance = 1.5f;
        [Tooltip("Seconds the finger must rest on a spot before Pip is sent.")]
        public float dwell = 0.35f;
        [Tooltip("How far the aim may wander (m) during the dwell.")]
        public float dwellRadius = 0.02f;

        Vector3 _aim;
        float _aimTime;
        bool _sent;

        void Update()
        {
            if (!TryAim(out var point))
            {
                _aimTime = 0f;
                _sent = false;
                if (marker != null) marker.gameObject.SetActive(false);
                return;
            }

            if (marker != null)
            {
                marker.gameObject.SetActive(true);
                marker.position = point + Vector3.up * 0.001f;
                float pulse = _sent ? 1f : 0.6f + 0.4f * Mathf.Clamp01(_aimTime / dwell);
                marker.localScale = Vector3.one * pulse;
            }

            if (Vector3.Distance(point, _aim) > dwellRadius)
            {
                _aim = point;
                _aimTime = 0f;
                _sent = false;
                return;
            }

            _aimTime += Time.deltaTime;
            if (!_sent && _aimTime >= dwell)
            {
                pip.SetTarget(_aim);
                _sent = true;
            }
        }

        bool TryAim(out Vector3 point)
        {
            point = default;
            foreach (var h in hands)
            {
                if (h == null || !h.IsTracked || !h.IsPointing) continue;
                var hits = Physics.RaycastAll(h.IndexTip, h.IndexDirection, maxDistance, ~0, QueryTriggerInteraction.Ignore);
                float best = float.MaxValue;
                bool found = false;
                foreach (var hit in hits)
                {
                    if (hit.distance < best && hit.collider.TryGetComponent<Walkable>(out var w) && w.isPointTarget)
                    {
                        best = hit.distance;
                        point = hit.point;
                        found = true;
                    }
                }
                if (found) return true;
            }
            return false;
        }
    }
}
