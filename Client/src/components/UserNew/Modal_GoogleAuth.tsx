interface MoodalId {
  showGAuth: boolean;
  setShowGAuth(showGAuth: boolean): void;
}

function ModalGoogleAuth(props:MoodalId) {

  const { showGAuth, setShowGAuth } = props;
  const qrImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAhIAAAISAQAAAACxRhsSAAAE0klEQVR4nO2dUYrjOhBFb70Y8inDW0Avxd7BW1LTS5odWEvJAhrsz4BCzYeqJDmZnnkwiSYTrj5MItsHGwqp6lZJFsXvtvjPbyMAMsgggwwyyCCDDDLIqAyxNkDmbQCAiwC4iMybCLD5BTMAmXd/n+1dyHhFBlRVFZOqqq4H1QUH1SWoYloPqktI0AVAPquayi+/bXmWdyHjdRlupyuAaT3kX6rrQYFgJ8xOVRUIyc/iQDsl408x9GMEZMZFMJ1EYOaYgDgCmFZA5g7PQQYZbRtuesIKiW8KQUgD4gg31pNAsY2PeQ4yyPhpu/JPs1ea53if2VvvNfgv+qdk9GdEEREZrTMH/dMKANuQDzIDkPfTAJlxyeH+/Z+DDDJ+2PK8X5OnGt/O4rP9RYCQgPiWoEAC4ngAEPbJ1md5FzJenWGqadZKjza9LyHlgRbTycZTVU1ANmAfY5/tXch4RUarNy0hWd8SEkwr1eR/1704pQn0T8noytBlO2oeSlUT8vAa5agyw4SofJDR1FUROeqOcY/nIIOML1ob75egHyHBI/+EnKPKaoBfZZdwPCWjC6PNRwFmmOYGFIk/H0q2yrwCb7RTMh7OQB1Fq8VaHIWD5pRpVk0bd7WIrbRTMrowdgMjzCYtta8e9DdZ/RJC1Xtpp2Q8nFFCeLU5HmFvsbA6lNyy7cLyVhxPyejEKONpQlMbZSZqZVE+5bvZZoXKPQXaKRmPZ5Q4ygv5gMP1iJkPqD4r9VMyOjOu60pVV8AMs6hRqMNrKDIV430y+jF2cZTHTJjUE1CWozKFyqN8cxI4npLRidHo/E1fXm0SSl/QUujv10yc98nox3BtCUDri6JdWYI65RevlPkoMv4AI0tSOasvYlM+YH0Aslcqc+3bmN8nozcjjoBn9QGZw9lKT4u7Ku+nAfohA/zEWcyUn+xdyHhBRvFPU9u34Ebdb0tQch/nfTK6Ma7jfV8kVcpN1lYwzeF/jqiK7dJOyXg442Ydn03qqu6ktptNeGq1alW0UzJ6MGx9VBw/ByCc83oSBS6DR0kXUWwDZFr/TRLHT9QQSu/3HGSQ8dPmk34qY2cZSl01rdWpVju9Mh9FRl9Gm9+fdDe9F+1fb1pq9vKhnZLxeIbbWo2Par1eHU9rCFUr+xnvk9GPkf1TAY4qCArE/86CKIckCJcBtnnPJwShvU/L4XnehYyXZ0xqIRSAUn2yHVU/xlJrmnfpc2E1Zwbu/RxkkPHj1tahVEmqWcwHVDm1qVMtsj/nfTIez2iCJAvra32Jr+OD1aHUVIDfTP+UjD6M63qpbLGm8xeZSncRla07YbxPRjdGm9+vG53n5g5pFVF3OX/G+2R0Y1yLo2asAKobWldIV9WK/ikZ/Rn1eyeIb2eR96L4l/1P83Wzp1YRhfv1kdGNcfO9k+IGXK3ouwr1XRfgeEpGT8bmX4OKItK4oXn/Uy2F0V7yj/x1qbs/Bxlk/D9GyNtGq8jovmgcL2IfQglnMf/0NHzNuMdzkEFGbdffO5HpdFQBBJi+jQJsIzB9GyDFMDWOKxDfkt/7LO9CxusyvvgeH1pPNbdSIm1eKf1TMvoxmn2jUDeUWrCLmWrBX7muMW/aKRkPZ4j++ppftPgs70IGGWSQQQYZZJBBxt/P+A4b9U6qUWAJ4AAAAABJRU5ErkJggg=="


    return showGAuth ? (
      <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
          
          <div className="text-[#000000] text-2xl flex justify-end w-full">
            <button
            type="button"
            onClick={() => {setShowGAuth(false)}}            
            >
            Close
            </button>          
          </div>
        
          <h1 className="text-[#000000] text-xl md:text-2xl md:mb-6">
            Bind your account
          </h1>

          {qrImageBase64 && (
            <img
              src={`data:image/png;base64,${qrImageBase64}`}
              alt="QR Code"
              className="max-w-full mb-4"
            />
          )}

          
        </div>
      </div>
    ) : null
  } 

  export { ModalGoogleAuth };