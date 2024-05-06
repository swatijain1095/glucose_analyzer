import Papa from "papaparse";
import "./style.scss";
import { MdCloudUpload } from "react-icons/md";

function UploadFile() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Papa.parse<File>(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          const regExp = new RegExp("[\\s_()-]+");
          const newHeader = header
            .split(regExp)
            .map((str, index) => {
              if (str === "") {
                return str;
              }
              // prettier-ignore
              // eslint-disable-next-line
              const regExp = new RegExp("\/+L");
              const formattedStr = str.replace(regExp, "");
              if (index === 0) {
                return formattedStr[0].toLowerCase() + formattedStr.slice(1);
              } else {
                return formattedStr[0].toUpperCase() + formattedStr.slice(1);
              }
            })
            .join("");
          return newHeader;
        },

        complete: function (results) {
          console.log(results.data);
        },
      });
    }
  };

  return (
    <div className="input">
      <input
        className="input--file"
        type="file"
        name="file"
        accept=".csv"
        id="file"
        onChange={handleChange}
      />
      <label className="input--label" htmlFor="file">
        <MdCloudUpload className="input--label__icon" size={"1.2em"} />
        Upload File
      </label>
    </div>
  );
}

export default UploadFile;
