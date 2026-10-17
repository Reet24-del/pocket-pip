using UnityEngine;

namespace PocketPip
{
    // Pip celebrates on reaching this spot.
    public class GoalZone : MonoBehaviour
    {
        public PipController pip;
        public float radius = 0.03f;

        bool _done;

        void Update()
        {
            if (_done || pip == null) return;
            Vector3 d = pip.transform.position - transform.position;
            d.y = 0f;
            if (d.magnitude < radius)
            {
                _done = true;
                pip.Celebrate();
                Debug.Log("[PocketPip] Pip reached the goal.");
            }
        }
    }
}
