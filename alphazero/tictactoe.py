# 틱택토 생성
import random
from time import time
from typing import List

# 게임 상태


class State:
    def __init__(self, pieces=None, enemy_pieces=None) -> None:
        self.pieces = pieces if pieces != None else [0] * 9
        self.enemy_pieces = enemy_pieces if enemy_pieces != None else [0] * 9

    def piece_count(self, pieces: List[int]):
        return pieces.count(1)

    def is_lose(self):
        def is_comp(x, y, dx, dy):
            for k in range(3):
                if y < 0 or 2 < y or x < 0 or 2 < x or self.enemy_pieces[x+y * 3] == 0:
                    return False
                x += dx
                y += dy
            return True

        if is_comp(0, 0, 1, 1) or is_comp(0, 2, 1, -1):
            return True
        for i in range(3):
            if is_comp(0, i, 1, 0) or is_comp(i, 0, 0, 1):
                return True
        return False

    def is_draw(self):
        return self.piece_count(self.pieces) + self.piece_count(self.enemy_pieces) == 9

    def is_done(self):
        return self.is_lose() or self.is_draw()

    def next(self, action: int):
        pieces = self.pieces.copy()
        pieces[action] = 1
        return State(self.enemy_pieces, pieces)

    def legal_actions(self):
        actions = []
        for i in range(9):
            if self.pieces[i] == 0 and self.enemy_pieces[i] == 0:
                actions.append(i)
        return actions

    def is_first_player(self):
        return self.piece_count(self.pieces) == self.piece_count(self.enemy_pieces)

    def __str__(self) -> str:
        ox = ('o', 'x') if self.is_first_player() else ('x', 'o')
        s = ''
        for i in range(9):
            if self.pieces[i] == 1:
                s += ox[0]
            elif self.enemy_pieces[i] == 1:
                s += ox[1]
            else:
                s += '-'
            if i % 3 == 2:
                s += '\n'
        return s


def random_acion(state: State):
    actions = state.legal_actions()
    return random.choice(actions)


def mini_max(state: State):
    if state.is_lose():
        return -1

    if state.is_draw():
        return 0

    best_score = -float('inf')
    for action in state.legal_actions():
        score = -mini_max(state.next(action))
        if score > best_score:
            best_score = score

    return best_score


def mini_max_action(state: State):
    best_score = -float('inf')
    best_action = 0
    str = ['', '']
    for action in state.legal_actions():
        score = -mini_max(state.next(action))
        if score > best_score:
            best_score = score
            best_action = action

        str[0] = '{}{:2d},'.format(str[0], action)
        str[1] = '{}{:2d},'.format(str[1], score)
    print('action:', str[0], '\nscore: ', str[1], '\n')

    return best_action


def alpha_beta(state: State, alpha: int, beta: int):
    if state.is_lose():
        return -1

    if state.is_draw():
        return 0

    for action in state.legal_actions():
        score = -alpha_beta(state.next(action), -beta, -alpha)
        if score > alpha:
            alpha = score

        if alpha >= beta:
            return alpha

    return alpha


def alpha_beta_action(state: State):
    alpha = -float('inf')
    best_action = 0
    str = ['', '']
    for action in state.legal_actions():
        score = -alpha_beta(state.next(action), -float('inf'), -alpha)
        if score > alpha:
            best_action = action
            alpha = score

        str[0] = '{}{:2d},'.format(str[0], action)
        str[1] = '{}{:2d},'.format(str[1], score)
    print('action:', str[0], '\nscore: ', str[1], '\n')

    return best_action


if __name__ == '__main__':
    state = State()

    # random ai vs random ai
    # while True:
    #     if state.is_done():
    #         break

    #     action = random_acion(state)

    #     state = state.next(action)
    #     print(state)
    #     print()

    start = time()
    # mini max ai vs random ai
    while True:
        if state.is_done():
            break

        if state.is_first_player():
            # start = time()
            action = alpha_beta_action(state)
            # print('time:', time() - start)
        else:
            action = random_acion(state)

        state = state.next(action)
        print(state)
        print()
    print('time:', time() - start)
