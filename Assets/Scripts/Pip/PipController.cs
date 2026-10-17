using UnityEngine;

namespace PocketPip
{
    // Pip walks toward a target over anything Walkable, stops at edges, rides moving
    // ground (a palm), and respawns at the last safe spot if the ground vanishes.
    public class PipController : MonoBehaviour
    {
        public enum State { Idle, Walking, WaitingAtEdge, Falling, Celebrating }

        public float walkSpeed = 0.06f;
        public float arriveDistance = 0.006f;
        [Tooltip("How far above/below Pip's feet a surface still counts as ground (m).")]
        public float stepTolerance = 0.04f;
        public float probeAhead = 0.012f;
        public Transform body;

        public State Current { get; private set; } = State.Idle;

        Vector3 _target;
        Collider _ground;
        Vector3 _groundLocalPos;
        // Stored relative to the ground it was on, so it stays valid if the house is moved.
        Collider _safeGround;
        Vector3 _safeLocalPos;
        float _stateTime;
        Vector3 _bodyRestPos;

        void Start()
        {
            if (body != null) _bodyRestPos = body.localPosition;
            if (Probe(transform.position, out var hit, out _))
            {
                Land(hit);
                RememberSafe();
            }
        }

        public void SetTarget(Vector3 worldPoint)
        {
            if (Current == State.Falling || Current == State.Celebrating) return;
            _target = worldPoint;
            Enter(State.Walking);
        }

        public void Celebrate() => Enter(State.Celebrating);

        void Update()
        {
            _stateTime += Time.deltaTime;
            RideGround();

            switch (Current)
            {
                case State.Walking: Walk(); break;
                case State.WaitingAtEdge: TryResume(); break;
                case State.Falling: Fall(); break;
            }
            Animate();
        }

        void RideGround()
        {
            if (Current == State.Falling) return;

            if (_ground == null || !_ground.enabled || !_ground.gameObject.activeInHierarchy)
            {
                // Ground disappeared under Pip (e.g. the hand flipped over).
                if (!Probe(transform.position, out var hit, out _))
                {
                    Enter(State.Falling);
                    return;
                }
                Land(hit);
            }
            transform.position = _ground.transform.TransformPoint(_groundLocalPos);
        }

        void Walk()
        {
            Vector3 to = _target - transform.position;
            to.y = 0f;
            if (to.magnitude < arriveDistance)
            {
                Enter(State.Idle);
                return;
            }

            Vector3 dir = to.normalized;
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(dir, Vector3.up), 10f * Time.deltaTime);

            float step = Mathf.Min(walkSpeed * Time.deltaTime, to.magnitude);
            Vector3 next = transform.position + dir * step;

            // Look a little ahead so Pip stops before stepping into a gap.
            if (!Probe(next + dir * probeAhead, out _, out _) || !Probe(next, out var hit, out _))
            {
                Enter(State.WaitingAtEdge);
                return;
            }

            transform.position = new Vector3(next.x, hit.point.y, next.z);
            Land(hit);
            if (hit.collider.TryGetComponent<Walkable>(out var w) && w.isSolidGround)
                RememberSafe();
        }

        // Keep checking the gap; as soon as something walkable appears (a palm), carry on.
        void TryResume()
        {
            Vector3 to = _target - transform.position;
            to.y = 0f;
            if (to.magnitude < arriveDistance) { Enter(State.Idle); return; }
            Vector3 dir = to.normalized;
            Vector3 next = transform.position + dir * walkSpeed * Time.deltaTime;
            if (Probe(next + dir * probeAhead, out _, out _) && Probe(next, out _, out _))
                Enter(State.Walking);
        }

        void Fall()
        {
            transform.position += Vector3.down * (0.3f * _stateTime) * Time.deltaTime;
            if (_stateTime > 0.6f)
            {
                if (_safeGround != null) transform.position = _safeGround.transform.TransformPoint(_safeLocalPos);
                if (Probe(transform.position, out var hit, out _)) Land(hit);
                Enter(State.Idle);
            }
        }

        bool Probe(Vector3 at, out RaycastHit best, out Walkable walkable)
        {
            best = default;
            walkable = null;
            Vector3 origin = at + Vector3.up * stepTolerance;
            var hits = Physics.RaycastAll(origin, Vector3.down, stepTolerance * 2f, ~0, QueryTriggerInteraction.Ignore);
            float bestDist = float.MaxValue;
            foreach (var h in hits)
            {
                if (h.distance < bestDist && h.collider.TryGetComponent<Walkable>(out var w))
                {
                    bestDist = h.distance;
                    best = h;
                    walkable = w;
                }
            }
            return walkable != null;
        }

        void RememberSafe()
        {
            _safeGround = _ground;
            _safeLocalPos = _groundLocalPos;
        }

        void Land(RaycastHit hit)
        {
            _ground = hit.collider;
            _groundLocalPos = _ground.transform.InverseTransformPoint(new Vector3(transform.position.x, hit.point.y, transform.position.z));
        }

        void Enter(State s)
        {
            if (s == State.Falling) _ground = null;
            Current = s;
            _stateTime = 0f;
        }

        // Placeholder animation until Pip has a rig: bob while walking, hop when waiting or celebrating.
        void Animate()
        {
            if (body == null) return;
            float y = 0f;
            switch (Current)
            {
                case State.Walking: y = Mathf.Abs(Mathf.Sin(_stateTime * 18f)) * 0.004f; break;
                case State.WaitingAtEdge: y = Mathf.Abs(Mathf.Sin(_stateTime * 6f)) * 0.008f; break;
                case State.Celebrating:
                    y = Mathf.Abs(Mathf.Sin(_stateTime * 9f)) * 0.015f;
                    body.localRotation = Quaternion.Euler(0f, _stateTime * 360f, 0f);
                    break;
            }
            body.localPosition = _bodyRestPos + Vector3.up * y;
        }
    }
}
