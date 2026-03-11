import { Player } from '@remotion/player'
import { C } from '../constants'
import DemoVideo, { DEMO_FPS, DEMO_WIDTH, DEMO_HEIGHT, DEMO_DURATION } from '../remotion/DemoVideo'

export default function DemoPlayer() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Browser frame */}
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${C.borderLight}`,
        boxShadow: `0 8px 40px ${C.shadowMd}`,
        background: C.white,
      }}>
        {/* Title bar */}
        <div style={{
          height: 36, background: C.offWhite,
          borderBottom: `1px solid ${C.borderLight}`,
          display: 'flex', alignItems: 'center', paddingLeft: 14, gap: 7,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>

        {/* Player */}
        <Player
          component={DemoVideo}
          durationInFrames={DEMO_DURATION}
          compositionWidth={DEMO_WIDTH}
          compositionHeight={DEMO_HEIGHT}
          fps={DEMO_FPS}
          controls
          autoPlay
          loop
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
