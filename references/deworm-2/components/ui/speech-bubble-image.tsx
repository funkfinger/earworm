export function SpeechBubbleImage() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", visibility: "hidden" }}>
      <defs>
        <pattern id="speech-bubble-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
          <path
            d="M10,10 C15,5 30,3 50,3 C70,3 85,5 90,10 C95,15 97,30 97,50 C97,70 95,85 90,90 C85,95 70,97 50,97 C30,97 15,95 10,90 C5,85 3,70 3,50 C3,30 5,15 10,10 Z"
            stroke="#727d71"
            strokeWidth="3"
            fill="#6a4f4b"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5,3"
          />
        </pattern>
      </defs>
    </svg>
  )
}

