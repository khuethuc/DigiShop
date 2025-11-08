import { Typography, Box, Stack, Button, Divider } from "@mui/material";
import { SendHorizonal } from "lucide-react";
import CommentCard from "./CommentCard";
import { time } from "console";

//Mock comments
const comments = [
  {asker: "nhanphan_hcmut", content: "Great quality account, works perfectly!", created_at: "01/10/2025"},
  {asker: "nak_hcmut", content: "The subscription lasted as promised, very satisfied!", created_at: "01/11/2025"},
];

const reps = [
  {responser: "digishop", content: "Thank you for your feedback! We're glad you're satisfied with the account", created_at: "02/10/2025"}
]

export default function Comment(){
    return (
        <Box sx={{maxWidth:900, width:"80%" }}>
            <Typography variant="h6" sx={{marginBottom: 3}}>
                Comments
            </Typography>

            <form>
              <textarea className="comment-inp" rows={3} placeholder="Write a comment" name="content">
              </textarea>
              <Button
                onClick=""
                variant="contained"
                sx={{
                  paddingX: 3,
                  paddingY: 1.2,
                  backgroundColor: "#2C7FFF",
                  color: "white",
                  fontSize: 15,
                  gap: 1,
                  borderRadius: 5
                }}
              >
                Send <SendHorizonal/>
              </Button>
            </form>

          <Divider sx={{marginTop: 3, marginBottom: 3}}/>
          
          <Stack spacing={5} sx={{width: "inherit", marginTop: 3}}>
            <CommentCard user={comments[0].asker} content={comments[0].content} time={comments[0].created_at}/>
            <CommentCard user={comments[1].asker} content={comments[1].content} time={comments[1].created_at}/>
          </Stack>
        </Box>
    );
}