import { AbsoluteFill, Sequence } from 'remotion'
import SceneEvents from './scenes/SceneEvents'
import SceneEventDetail from './scenes/SceneEventDetail'
import SceneLeaderboard from './scenes/SceneLeaderboard'
import SceneOutro from './scenes/SceneOutro'

// Each scene: 120 frames (4 seconds at 30fps)
const SCENE_DURATION = 120

export default function DemoVideo() {
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <SceneEvents />
      </Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <SceneEventDetail />
      </Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <SceneLeaderboard />
      </Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  )
}

export const DEMO_FPS = 30
export const DEMO_WIDTH = 1280
export const DEMO_HEIGHT = 720
export const DEMO_DURATION = SCENE_DURATION * 4 // 480 frames = 16 seconds
