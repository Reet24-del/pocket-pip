using UnityEngine;

namespace PocketPip
{
    // Reads one tracked hand and exposes the few things the game cares about:
    // palm position/normal, finger extension and an index-finger pointing ray.
    // Works with both the OpenXR (XRHand_*) and legacy (Hand_*) Meta skeletons.
    [DefaultExecutionOrder(-50)]
    public class HandPose : MonoBehaviour
    {
        public OVRHand hand;
        public OVRSkeleton skeleton;
        public bool isLeft;

        [Tooltip("Tip-to-wrist / knuckle-to-wrist ratio above which a finger counts as extended.")]
        public float extendedRatio = 1.55f;
        [Tooltip("Ratio below which a finger counts as curled.")]
        public float curledRatio = 1.35f;

        public bool IsTracked { get; private set; }
        public Vector3 Wrist { get; private set; }
        public Vector3 PalmCenter { get; private set; }
        public Vector3 PalmNormal { get; private set; }
        public Vector3 HandForward { get; private set; }
        public Vector3 MiddleTip { get; private set; }
        public Vector3 IndexTip { get; private set; }
        public Vector3 IndexDirection { get; private set; }
        public Vector3 PalmVelocity { get; private set; }

        // 0 = thumb (unused), 1 = index, 2 = middle, 3 = ring, 4 = little
        readonly bool[] _extended = new bool[5];
        readonly bool[] _curled = new bool[5];

        Transform _wrist, _thumbTip;
        readonly Transform[] _proximal = new Transform[5];
        readonly Transform[] _tip = new Transform[5];
        bool _bound;
        Vector3 _lastPalm;
        bool _hasLastPalm;

        public bool IsExtended(int finger) => _extended[finger];
        public bool IsCurled(int finger) => _curled[finger];

        public bool IsFlat => _extended[1] && _extended[2] && _extended[3] && _extended[4];
        public bool IsPointing => _extended[1] && _curled[2] && _curled[3] && _curled[4];

        void Update()
        {
            IsTracked = hand != null && hand.IsTracked && skeleton != null && skeleton.IsDataValid;
            if (!IsTracked)
            {
                _hasLastPalm = false;
                return;
            }
            if (!_bound && !TryBind())
            {
                IsTracked = false;
                return;
            }

            Wrist = _wrist.position;
            for (int f = 1; f <= 4; f++)
            {
                float knuckle = Vector3.Distance(_proximal[f].position, Wrist);
                float tip = Vector3.Distance(_tip[f].position, Wrist);
                float ratio = knuckle > 0.0001f ? tip / knuckle : 0f;
                _extended[f] = ratio > extendedRatio;
                _curled[f] = ratio < curledRatio;
            }

            Vector3 indexKnuckle = _proximal[1].position;
            Vector3 littleKnuckle = _proximal[4].position;
            Vector3 middleKnuckle = _proximal[2].position;

            // Cross of (wrist->index knuckle) x (wrist->little knuckle) points out of the
            // palm for the left hand and out of the back of the hand for the right hand.
            Vector3 n = Vector3.Cross(indexKnuckle - Wrist, littleKnuckle - Wrist).normalized;
            PalmNormal = isLeft ? n : -n;

            PalmCenter = Vector3.Lerp(Wrist, middleKnuckle, 0.6f);
            MiddleTip = _tip[2].position;
            HandForward = (MiddleTip - Wrist).normalized;
            IndexTip = _tip[1].position;
            IndexDirection = (IndexTip - indexKnuckle).normalized;

            if (_hasLastPalm && Time.deltaTime > 0f)
            {
                Vector3 v = (PalmCenter - _lastPalm) / Time.deltaTime;
                PalmVelocity = Vector3.Lerp(PalmVelocity, v, 0.2f);
            }
            _lastPalm = PalmCenter;
            _hasLastPalm = true;
        }

        bool TryBind()
        {
            if (!skeleton.IsInitialized || skeleton.Bones == null || skeleton.Bones.Count == 0)
                return false;

            var type = skeleton.GetSkeletonType();
            bool openXr = type == OVRSkeleton.SkeletonType.XRHandLeft || type == OVRSkeleton.SkeletonType.XRHandRight;

            _wrist = Find(openXr ? OVRSkeleton.BoneId.XRHand_Wrist : OVRSkeleton.BoneId.Hand_WristRoot);
            _thumbTip = Find(openXr ? OVRSkeleton.BoneId.XRHand_ThumbTip : OVRSkeleton.BoneId.Hand_ThumbTip);
            _proximal[1] = Find(openXr ? OVRSkeleton.BoneId.XRHand_IndexProximal : OVRSkeleton.BoneId.Hand_Index1);
            _proximal[2] = Find(openXr ? OVRSkeleton.BoneId.XRHand_MiddleProximal : OVRSkeleton.BoneId.Hand_Middle1);
            _proximal[3] = Find(openXr ? OVRSkeleton.BoneId.XRHand_RingProximal : OVRSkeleton.BoneId.Hand_Ring1);
            _proximal[4] = Find(openXr ? OVRSkeleton.BoneId.XRHand_LittleProximal : OVRSkeleton.BoneId.Hand_Pinky1);
            _tip[1] = Find(openXr ? OVRSkeleton.BoneId.XRHand_IndexTip : OVRSkeleton.BoneId.Hand_IndexTip);
            _tip[2] = Find(openXr ? OVRSkeleton.BoneId.XRHand_MiddleTip : OVRSkeleton.BoneId.Hand_MiddleTip);
            _tip[3] = Find(openXr ? OVRSkeleton.BoneId.XRHand_RingTip : OVRSkeleton.BoneId.Hand_RingTip);
            _tip[4] = Find(openXr ? OVRSkeleton.BoneId.XRHand_LittleTip : OVRSkeleton.BoneId.Hand_PinkyTip);

            _bound = _wrist != null && _thumbTip != null;
            for (int f = 1; f <= 4; f++)
                _bound &= _proximal[f] != null && _tip[f] != null;
            return _bound;
        }

        Transform Find(OVRSkeleton.BoneId id)
        {
            foreach (var bone in skeleton.Bones)
                if (bone.Id == id)
                    return bone.Transform;
            return null;
        }
    }
}
