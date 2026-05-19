import { X, Bot, Loader2, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

function ReportUpload({
  selectedFile,
  setSelectedFile,
  imagePreview,
  useAI,
  setUseAI,
  aiAnalyzing,
  aiResult,
  aiError,
  categoryRejected,
  onAnalyze,
}) {
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
  }

  return (
    <section className="!mt-10">
      <h2 className="!text-xl !font-bold !mb-5">3. Фотографија</h2>

      <div className="!border-2 !border-dashed !border-gray-200 !rounded-2xl !py-10 sm:!py-16 !px-5 sm:!px-6 !text-center hover:!bg-gray-50">
        <div className="!w-16 !h-16 !mx-auto !rounded-full !bg-gray-100 !flex !items-center !justify-center !text-3xl !mb-5">
          📷
        </div>

        <h3 className="!font-bold !text-lg">
          Прикачи фотографија од проблемот
        </h3>

        <p className="!text-gray-500 !mt-2">
          Дозволени формати: JPG, PNG (макс. 10MB)
        </p>

        <div className="!mt-6 !flex !flex-col sm:!flex-row !gap-3 !justify-center">
          <label className="!inline-block !border !border-gray-200 !rounded-xl !px-6 !py-3 !font-semibold cursor-pointer hover:!bg-white">
            ⬆ Избери датотека
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <label className="!inline-block !border !border-gray-200 !rounded-xl !px-6 !py-3 !font-semibold cursor-pointer hover:!bg-white">
            📸 Фотографирај
            <input
              type="file"
              accept="image/png, image/jpeg"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <p className="!mt-4 !text-blue-500 !font-semibold !break-words">
            Избрана слика: {selectedFile.name}
          </p>
        )}
      </div>

      {selectedFile && imagePreview && (
        <div className="!mt-6 !border !border-gray-200 !rounded-2xl !overflow-hidden !bg-white !shadow-sm">
          <div className="!flex !items-center !justify-between !px-4 !py-3 !bg-gray-50 !border-b !border-gray-100">
            <span className="!text-sm !font-semibold !text-gray-700">
              Преглед на слика
            </span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="!text-gray-400 hover:!text-red-500 !transition"
              title="Отстрани слика"
            >
              <X size={18} />
            </button>
          </div>

          <div className="!relative !max-h-[300px] !overflow-hidden !flex !items-center !justify-center !bg-gray-100">
            <img
              src={imagePreview}
              alt="Преглед"
              className="!max-w-full !max-h-[300px] !object-contain"
            />
          </div>

          <div className="!px-5 !py-4 !border-t !border-gray-100">
            <label className="!flex !items-center !gap-3 !cursor-pointer !select-none">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="!w-5 !h-5 !accent-[#0a96f4] !rounded"
                disabled={aiAnalyzing || !!aiResult}
              />
              <div className="!flex !items-center !gap-2">
                <Sparkles size={16} className="!text-[#0a96f4]" />
                <span className="!text-sm !font-semibold !text-gray-700">
                  Генерирај AI категорија и опис
                </span>
              </div>
            </label>

            {useAI && !aiResult && !aiAnalyzing && !aiError && (
              <button
                type="button"
                onClick={onAnalyze}
                className="!mt-4 !w-full !flex !items-center !justify-center !gap-2 !bg-[#0a96f4] !text-white !font-semibold !text-sm !py-3 !rounded-xl hover:!bg-blue-600 !transition"
              >
                <Bot size={16} />
                Анализирај со AI
              </button>
            )}

            {aiAnalyzing && (
              <div className="!flex !items-center !gap-3 !mt-4 !py-3">
                <div className="!w-9 !h-9 !rounded-xl !bg-blue-100 !flex !items-center !justify-center !shrink-0">
                  <Loader2 size={18} className="!text-[#0a96f4] !animate-spin" />
                </div>
                <div>
                  <p className="!text-sm !font-semibold !text-gray-700 !m-0">
                    AI ја анализира сликата...
                  </p>
                  <p className="!text-xs !text-gray-400 !mt-0.5 !m-0">
                    Ова може да потрае неколку секунди
                  </p>
                </div>
              </div>
            )}

            {aiResult && !categoryRejected && (
              <div className="!mt-4 !space-y-3">
                <div className="!flex !items-center !gap-2">
                  <CheckCircle2 size={16} className="!text-green-600" />
                  <span className="!text-sm !font-semibold !text-green-700">
                    AI анализа завршена
                  </span>
                </div>

                <div className="!rounded-xl !border !border-blue-100 !bg-blue-50 !p-4">
                  <div className="!flex !items-center !gap-2 !mb-2">
                    <Bot size={14} className="!text-[#0a96f4]" />
                    <p className="!text-[10px] !font-bold !uppercase !tracking-widest !text-[#0a96f4] !m-0">
                      AI опис
                    </p>
                  </div>
                  <p className="!text-sm !text-gray-700 !leading-relaxed !m-0">
                    {aiResult.aiDescription}
                  </p>
                </div>

                <div className="!flex !items-center !gap-2 !text-xs !text-gray-500">
                  <span className="!font-semibold">Детектирана категорија:</span>
                  <span className="!px-2 !py-1 !rounded-full !bg-green-100 !font-semibold !text-green-700">
                    {aiResult.categoryLabel}
                  </span>
                </div>
              </div>
            )}

            {categoryRejected && (
              <div className="!mt-4 !rounded-xl !border !border-red-200 !bg-red-50 !p-4">
                <div className="!flex !items-center !gap-2 !mb-2">
                  <AlertTriangle size={16} className="!text-red-500" />
                  <span className="!text-sm !font-bold !text-red-700">
                    Сликата не одговара на позната категорија
                  </span>
                </div>
                <p className="!text-xs !text-red-600 !leading-relaxed !m-0">
                  Прикачената слика не може да се класифицира во ниедна од
                  понудените категории на проблеми. Ве молиме прикачете слика
                  која јасно го прикажува проблемот.
                </p>
              </div>
            )}

            {aiError && !categoryRejected && (
              <div className="!mt-4 !rounded-xl !border !border-orange-200 !bg-orange-50 !p-4">
                <div className="!flex !items-center !gap-2">
                  <AlertTriangle size={16} className="!text-orange-500" />
                  <span className="!text-sm !font-semibold !text-orange-700">
                    AI анализата не успеа. Обидете се повторно.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ReportUpload;