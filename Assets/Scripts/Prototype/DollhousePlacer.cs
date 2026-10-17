using UnityEngine;

namespace PocketPip
{
    // Until table detection is in, drop the house in front of the seated player:
    // a comfortable distance ahead and below eye level, facing them.
    public class DollhousePlacer : MonoBehaviour
    {
        public Transform head;
        public float forward = 0.45f;
        public float belowEyes = 0.32f;

        bool _placed;

        void LateUpdate()
        {
            if (_placed || head == null) return;
            // Wait until the headset reports a real pose.
            if (head.localPosition == Vector3.zero && head.localRotation == Quaternion.identity) return;

            Vector3 flatForward = Vector3.ProjectOnPlane(head.forward, Vector3.up).normalized;
            if (flatForward.sqrMagnitude < 1e-6f) return;

            transform.SetPositionAndRotation(
                head.position + flatForward * forward + Vector3.down * belowEyes,
                Quaternion.LookRotation(flatForward, Vector3.up));
            _placed = true;
        }

        // Re-centre on demand, e.g. after the player shifts in their chair.
        public void Replace() => _placed = false;
    }
}
