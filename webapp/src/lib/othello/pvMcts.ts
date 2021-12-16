// ====================
// 몬테카를로 트리 탐색 생성
// ====================

// 패키지 임포트
import * as tf from '@tensorflow/tfjs';
import { sum } from 'lodash';
import MNode from './MNode';
import Reversi from './Reversi';

// 파라미터 준비
const PV_EVALUATE_COUNT = 50; // 추론 1회당 시뮬레이션 횟수(오리지널: 1600회)
const DN_INPUT_SHAPE = [6, 6, 2];
const SP_TEMPERATURE = 1.0;

// 볼츠만 분포
function boltzman(xs: number[], temperature: number) {
  const _xs = xs.map((x) => x ** (1 / temperature));

  return _xs.map((x) => x / sum(_xs));
}

// 추론
export async function predict(model: tf.LayersModel, state: Reversi) {
  // 추론을 위한 입력 데이터 셰이프 변환
  const [a, b, c] = DN_INPUT_SHAPE;
  let x = tf.tensor([state.pieces, state.enemyPieces]);
  x = x.reshape([c, a, b]).transpose([1, 2, 0]).reshape([1, a, b, c]);
  // x.shape = [1, 6, 6, 2]

  // 추론
  const [y1, y2] = model.predict(x, { batchSize: 1 }) as tf.Tensor<tf.Rank>[];

  // 정책 얻기
  const legalActions = state.legalActions();
  const [y1Array] = (await y1.array()) as number[][];

  let policies = y1Array.filter((_, i) => legalActions.includes(i));
  const [[value]] = (await y2.array()) as number[][];

  const sumPolicies = sum(policies);

  // policies 를 합계 1의 확률 분포로 변환
  policies = sumPolicies ? policies.map((p) => p / sumPolicies) : policies;

  console.log({ policies });

  return { policies, value };
}

// 노드 리스트를 시행 횟수 리스트로 변환
export function nodesToScores(nodes: MNode[]) {
  if (nodes.length === 0) {
    return [];
  }

  const scores = nodes.map((node) => node.n);

  return scores;
}

// 몬테카를로 트리 탐색 스코어 얻기
async function pvMctsScores(model: tf.LayersModel, state: Reversi, temperature: number) {
  // 몬테카를로 트리 탐색 노드 정의

  // 현재 국면의 노드 생성
  const rootNode = new MNode(state, 0);

  // 여러 차례 평가 실행
  for (let i = 0; i < PV_EVALUATE_COUNT; i += 1) {
    rootNode.evaluate(model);
  }
  // 합법적인 수의 확률 분포
  let scores: number[] = nodesToScores(rootNode.childNodes);
  console.log({ scores });
  if (temperature === 0) {
    // 최대값인 경우에만 1
    const action = (await tf.argMax(scores).data())[0];
    return scores.map((_, i) => (i === action ? 1 : 0));
  }
  // 볼츠만 분포를 기반으로 분산 추가
  scores = boltzman(scores, temperature);
  return scores;
}

function randomChoice(legalActions: number[], p: number[]) {
  const n = Math.random();
  let s = 0;
  for (let i = 0; i < legalActions.length; i += 1) {
    s += p[i];
    if (s >= n) {
      return legalActions[i];
    }
  }

  return legalActions[legalActions.length - 1];
}

// 몬테카를로 트리 탐색을 활용한 행동 선택
function pvMctsAction(model: tf.LayersModel, temperature = 0.0) {
  async function _pvMctsAction(reversi: Reversi) {
    const newReversi = new Reversi(reversi.pieces.slice(), reversi.enemyPieces.slice(), reversi.depth);
    const scores = await pvMctsScores(model, newReversi, temperature);
    console.log({ Scores: scores });
    const choiced = randomChoice(newReversi.legalActions(), scores);
    console.log({ choiced });
    return choiced;
  }

  return _pvMctsAction;
}

export default pvMctsAction;
