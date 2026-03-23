import SideBar from "./SideBar";
export default function Infrastructure(){
    return (
        <div className="flex">
                <SideBar />
                    <div className=" flex min-h-screen w-full bg-gray-50">
                      <main className="w-[100%] p-6 bg-white">
                        <h1 className="text-2xl font-bold text-red-900 mb-4">Cơ sở vật chất</h1>
                        <p className="text-gray-600 leading-relaxed">
                            Đây là nơi hiển thị nội dung chi tiết của trang giới thiệu. 
                            Khi bạn chia cột như thế này, nội dung sẽ không bị menu đè lên nữa.
                        </p>
                      </main>
                    </div>
            </div>
    )
}