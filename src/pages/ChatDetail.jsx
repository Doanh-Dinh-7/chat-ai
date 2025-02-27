import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ImgTemp from "../assets/temp.jpeg";
import IconMenu from "../assets/menu.png";
import SideBar from "../components/SideBar";
import IconStar from "../assets/star.png";
import AiChat from "../aiChat";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setNameChat } from "../strore/chatSlice/index";
import { handleNewChatThunk } from "../strore/chatSlice/sideBarThunk";

function ChatDetail() {
  const [menuToggle, setMenuToggle] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [messageDetail, setMessageDetail] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [initialPath, setInitialPath] = useState("");
  const { id } = useParams();
  const { data } = useSelector((state) => state.chat);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.length > 0) {
      const chat = data.find((chat) => chat.id === id);
      if (chat) {
        setDataDetail(chat);
        setMessageDetail(chat.messages);
      }
    }
  }, [data, id]);

  useEffect(() => {
    if (location.pathname === "/chat/info") {
      setInitialPath(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id && initialPath === "/chat/info" && inputChat !== "") {
      handleChatDetail();
    }
  }, [id, initialPath]); // Gọi handleChatDetail khi id hoặc URL thay đổi

  const handleChatDetail = async () => {
    if (!id) {
      const newChatId = await dispatch(handleNewChatThunk());
      if (newChatId) {
        navigate(`/chat/${newChatId}`);
      }
    }
    if (id) {
      const chatText = await AiChat(inputChat, messageDetail);
      if (dataDetail.title === "Chat" || dataDetail.length === 0) {
        const promptName = `This is a new chat, and user ask about ${inputChat}. No rely and comment just give me a name for this chat, Max length is 10 characters`;
        const newTitle = await AiChat(promptName);
        dispatch(setNameChat({ newTitle, chatId: id }));
      }
      if (chatText) {
        const dataMessage = {
          idChat: id,
          userMess: inputChat,
          botMess: chatText,
        };
        dispatch(addMessage(dataMessage));
        setInputChat("");
      }
    }
  };

  return (
    <div className="text-white xl:w-[80%] w-full relative">
      <div className="flex items-center space-x-2 p-4">
        <button onClick={() => setMenuToggle(!menuToggle)}>
          <img src={IconMenu} alt="menu icon" className="w-8 h-8 xl:hidden" />
        </button>
        <h1 className="text-xl uppercase font-bold p-4">Zui Vá Đi Thôi</h1>
      </div>

      {menuToggle && (
        <div className="absolute w-auto h-full top-0 left-0 xl:hidden">
          <SideBar onToggle={() => setMenuToggle(!menuToggle)} />
        </div>
      )}
      <div className="max-w-[90%] w-full mx-auto mt-15 space-y-10">
        {id ? (
          <div className="flex flex-col space-y-4 p-4 h-[480px] overflow-x-hidden overflow-y-auto">
            {Array.isArray(messageDetail) &&
              messageDetail.map((item) => (
                <div className="flex flex-col space-y-6" key={item.id}>
                  <div className="flex space-x-6 items-baseline">
                    {item.isBot ? (
                      <>
                        <img src={IconStar} alt="star" className="w-8 h-8" />
                        <p
                          dangerouslySetInnerHTML={{ __html: item.text }}
                          className="text-lg"
                        />
                      </>
                    ) : (
                      <>
                        <p>User</p>
                        <p className="text-lg">{item.text}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-5">
            <div className="space-y-1">
              <h2 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-[30px] inline-block text-transparent bg-clip-text font-bold">
                Xin Chào
              </h2>
              <p className="text-3xl">Hôm nay tôi có thể giúp gì cho bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-[200px] h-[200px] bg-primaryBg-sideBar flex items-center justify-center rounded-lg">
                <p>Kiểm tra</p>
              </div>
              <div className="w-[200px] h-[200px] bg-primaryBg-sideBar flex items-center justify-center rounded-lg">
                <p>Luyện tập</p>
              </div>
              <div className="w-[200px] h-[200px] bg-primaryBg-sideBar flex items-center justify-center rounded-lg">
                <p>Luyện thi tự luận</p>
              </div>
              <div className="w-[200px] h-[200px] bg-primaryBg-sideBar flex items-center justify-center rounded-lg flex-col">
                <p>Luyện thi vấn đáp</p>
                <img
                  src={ImgTemp}
                  alt="temp img"
                  className="w-[150px] h-[150px]"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-4 w-full">
          <input
            type="text"
            value={inputChat}
            placeholder="Nhập câu lệnh tại đây"
            className="rounded-lg p-4 bg-primaryBg-default border w-[90%]"
            onChange={(e) => setInputChat(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold p-4 rounded-lg"
            onClick={handleChatDetail}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatDetail;
