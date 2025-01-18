import React, { ChangeEventHandler, useState } from "react";

export const Page: React.FC<{ selectedText: string | null }> = ({
  selectedText,
}) => {
  const [question, setQuestion] = useState<string>(
    selectedText ?? "なっしんぐ"
  );

  const [answer, setAnswer] = useState<string>("");
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);

  const onClick = () => {
    alert("押され番長");
  };

  const onQuestionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setQuestion(e.target.value);
  };

  const handleMultiAnswerChange = (value: string) => {
    setMultiAnswers((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">AI家庭教師くん</h1>

      <div className="mb-6">
        <textarea
          id="question"
          placeholder="質問を入力してください~~"
          value={question}
          onChange={onQuestionChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          id="askButton"
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
        >
          質問する
        </button>
      </div>

      <div id="response" className="p-4 bg-white border rounded mb-6">
        ここに回答が表示されます。
      </div>

      <button
        onClick={onClick}
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-400 transition-colors"
      >
        押され番長
      </button>

      {/* クイズセクション */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">クイズ形式</h2>

        {/* マルバツ形式 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">マルバツ形式</h3>
          <div className="flex gap-4">
            <button className="py-2 px-6 bg-red-500 text-white rounded hover:bg-red-400 transition-colors">
              マル
            </button>
            <button className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors">
              バツ
            </button>
          </div>
        </div>

        {/* 4択形式 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">4択形式</h3>
          <div className="grid grid-cols-2 gap-4">
            {["選択肢1", "選択肢2", "選択肢3", "選択肢4"].map((choice, index) => (
              <button
                key={index}
                className="py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-400 transition-colors"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        {/* 4択（複数回答可）形式 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-600 mb-2">
            4択（複数回答可）
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {["選択肢1", "選択肢2", "選択肢3", "選択肢4"].map((choice, index) => (
              <label
                key={index}
                className="flex items-center gap-2 bg-orange-100 border border-orange-300 p-2 rounded cursor-pointer hover:bg-orange-200"
              >
                <input
                  type="checkbox"
                  value={choice}
                  checked={multiAnswers.includes(choice)}
                  onChange={() => handleMultiAnswerChange(choice)}
                  className="accent-orange-500"
                />
                {choice}
              </label>
            ))}
          </div>
        </div>

        {/* 自由記述形式 */}
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-2">自由記述形式</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="自由に答えを書いてください"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
