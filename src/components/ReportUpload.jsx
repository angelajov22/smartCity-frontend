function ReportUpload({ selectedFile, setSelectedFile }) {
  function handleFileChange(event) {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  return (
    <section className="mt-10">
      <h2 className="!text-xl !font-bold !mb-5">3. Фотографија</h2>

      <label className="!block !border-2 !border-dashed !border-gray-200 !rounded-2xl !py-16 !px-6 !text-center cursor-pointer hover:!bg-gray-50">
        <div className="!w-16 !h-16 !mx-auto !rounded-full !bg-gray-100 !flex !items-center !justify-center !text-3xl !mb-5">
          📷
        </div>

        <h3 className="!font-bold !text-lg">
          Прикачи фотографија од проблемот
        </h3>

        <p className="text-gray-500 mt-2">
          Дозволени формати: JPG, PNG (макс. 10MB)
        </p>

        <div className="mt-6 inline-block border border-gray-200 rounded-xl px-6 py-3 font-semibold">
          ⬆ Избери датотека
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile && (
          <p className="mt-4 text-blue-500 font-semibold">
            Избрана слика: {selectedFile.name}
          </p>
        )}
      </label>
    </section>
  )
}

export default ReportUpload