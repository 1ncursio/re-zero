/* eslint-disable indent */
import { ArcElement, Chart, Tooltip } from 'chart.js';
import { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import useAIHistoriesSWR from '@hooks/swr/useAIHistoriesSWR';
import useUsersAIHistoriesSWR from '@hooks/swr/useUsersAIHistoriesSWR';

Chart.register(ArcElement, Tooltip);

const AIHistory: FC = () => {
  const { data: aiHistoriesData } = useAIHistoriesSWR();
  const { data: usersAIHistoriesData } = useUsersAIHistoriesSWR();

  return (
    <div className="flex flex-col justify-evenly">
      {aiHistoriesData && (
        <div className="flex flex-col items-center w-48 gap-4">
          <span className="text-blueGray-600">
            <span>알파제로의 총 전적</span>
          </span>
          <span className="text-sm text-blueGray-600">{`${aiHistoriesData.histories.length}전 ${aiHistoriesData.count.white_win}승 ${aiHistoriesData.count.black_win}패 ${aiHistoriesData.count.draw}무`}</span>
          <div className="relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 text-lg text-sky-500 cursor-default">{`${aiHistoriesData.white_win_rate}%`}</span>
            <Doughnut
              width={128}
              height={128}
              data={{
                labels: ['승', '패', '무', '전적 없음'],
                datasets: [
                  {
                    data:
                      aiHistoriesData.histories.length > 0
                        ? [
                            aiHistoriesData.count.white_win,
                            aiHistoriesData.count.black_win,
                            aiHistoriesData.count.draw,
                          ]
                        : [0, 0, 0, 1],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                    ],
                  },
                ],
              }}
              options={{
                cutout: 50,
              }}
            />
          </div>
        </div>
      )}

      {usersAIHistoriesData && (
        <div className="flex flex-col items-center w-48 gap-4">
          <span className="text-blueGray-600">
            <span>나의 전적</span>
          </span>
          <span className="text-sm text-blueGray-600">{`${usersAIHistoriesData.histories.length}전 ${usersAIHistoriesData.count.black_win}승 ${usersAIHistoriesData.count.white_win}패 ${usersAIHistoriesData.count.draw}무`}</span>
          <div className="relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 text-lg text-sky-500 cursor-default">{`${usersAIHistoriesData.black_win_rate}%`}</span>
            <Doughnut
              width={128}
              height={128}
              data={{
                labels: ['승', '패', '무', '전적 없음'],
                datasets: [
                  {
                    data:
                      usersAIHistoriesData.histories.length > 0
                        ? [
                            usersAIHistoriesData.count.black_win,
                            usersAIHistoriesData.count.white_win,
                            usersAIHistoriesData.count.draw,
                          ]
                        : [0, 0, 0, 1],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                    ],
                  },
                ],
              }}
              options={{
                cutout: 50,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHistory;
