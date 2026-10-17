using UnityEngine;

namespace PocketPip
{
    // Marks a collider as ground Pip can stand on.
    public class Walkable : MonoBehaviour
    {
        [Tooltip("Pip remembers the last safe spot on solid ground to respawn after a fall. Hands are not safe.")]
        public bool isSolidGround = true;

        [Tooltip("Pointing at this surface can send Pip here.")]
        public bool isPointTarget = true;
    }
}
