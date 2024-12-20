import { Typography, Box } from "@mui/material";
import { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

export default function ChatBox({ chat }: { chat: string[][] }) {
    const chatBoxRef = useRef<HTMLDivElement>(null);

    // チャットが更新されるたびに一番下までスクロールするための処理
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chat]);

    return (
        <Box 
            sx={{ 
                margin: '0 10%', 
                border: 'solid', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-start',
                height: 'calc(100vh - 350px)',  // ウィンドウの高さからヘッダーや他のコンテンツ分を引く
                overflow: 'auto',  // 溢れた場合のスクロールを有効にする
            }}
            ref={chatBoxRef}
        >
            <Box sx={{display: 'flex', justifyContent: 'flex-start', margin: '8px'}}>
                <Typography variant="h6" sx={{borderBottom: 'solid'}}>
                    回答テキスト
                </Typography>
            </Box>
            {chat.map((message, index) => (
                <Box 
                key={index}
                sx={{
                    display: 'flex',
                    justifyContent: message[0] === 'user' ? 'flex-end' : 'flex-start', // 吹き出しの配置を切り替え
                    margin: '8px 16px',
                }}
            >
                <Box
                    sx={{
                        padding: '8px 16px',
                        backgroundColor: message[0] === 'user' ? '#f1f0f0' : '#e0f7fa', // 配色を変更
                        borderRadius: message[0] === 'user' 
                            ? '15px 15px 0 15px' 
                            : '15px 15px 15px 0', // 吹き出しの形状を変える
                        maxWidth: '80%', // 幅を制限
                        wordWrap: 'break-word', // 長い単語を折り返し
                        wordBreak: 'break-word', // 折り返し処理
                        overflowWrap: 'break-word', // テキストのはみ出し防止
                        overflow: 'auto', // はみ出し防止のため
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box sx={{ textAlign: 'left' }}>
                        <ReactMarkdown>
                            {message[1]}
                        </ReactMarkdown>
                    </Box>
                </Box>
            </Box>
            ))}
        </Box>
    );
}



/*
    <Typography key={index} variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {chat}
    </Typography>
    として改行を反映させることが可能？chatAPIの出力テキストがどうなっているかによる。
*/