import * as tf from '@tensorflow/tfjs';
import { sum } from 'lodash';
import { nodesToScores, predict } from './pvMcts';
import Reversi from './Reversi';

export default class MNode {
  public state: Reversi;

  public p: number;

  public w: number;

  public n: number;

  public childNodes: MNode[];

  // 노드 초기화
  constructor(state: Reversi, p: number) {
    this.state = state; // 상태
    this.p = p; // 정책
    this.w = 0; // 가치 누계
    this.n = 0; // 시행 횟수
    this.childNodes = []; // 자식 노드들
  }

  // 국면 가치 누계
  public async evaluate(model: tf.LayersModel) {
    // 게임 종료 시
    console.log('eval');
    if (this.state.isDone()) {
      // 승패 결과로 가치 얻기
      const value = this.state.isLoss() ? -1 : 0;

      // 누계 가치와 시행 횟수 갱신
      this.w += value;
      this.n += 1;
      return value;
    }
    // 자녀 노드가 존재하지 않는 경우
    if (this.childNodes.length === 0) {
      // 뉴럴 네트워크 추론을 활용한 정책과 가치 얻기
      const { policies, value } = await predict(model, this.state);

      // 누계 가치와 시행 횟수 갱신
      this.w += value;
      this.n += 1;

      const legalActions = this.state.legalActions();

      for (let i = 0; i < legalActions.length; i += 1) {
        const [legalAction, policy] = [legalActions[i], policies[i]];
        this.childNodes.push(new MNode(this.state.next(legalAction), policy));
        return value;
      }
    }
    // 자녀 노드가 존재하지 않는 경우
    // 아크 평갓값이 가장 큰 자녀 노드를 평가해 가치 얻기
    const nextChildNode = await this.nextChildNode();
    const value: number = (await nextChildNode.evaluate(model)) * -1;

    // 누계 가치와 시행 횟수 갱신
    this.w += value;
    this.n += 1;
    return value;
  }

  // 아크 평가가 가장 큰 자녀 노드 얻기
  async nextChildNode() {
    // 아크 평가 계산
    const C_PUCT = 1.0;
    const t = sum(nodesToScores(this.childNodes));
    const pucbValues: number[] = [];

    for (let i = 0; i < this.childNodes.length; i += 1) {
      const childNode = this.childNodes[i];
      pucbValues.push(
        (childNode.n ? -childNode.w / childNode.n : 0.0) +
          (C_PUCT * childNode.p * Math.sqrt(t)) / (1 + childNode.n),
      );
    }

    // 아크 평갓값이 가장 큰 자녀 노드 반환
    const maxNode = (await tf.argMax(tf.tensor(pucbValues)).data())[0];
    return this.childNodes[maxNode];
  }
}
