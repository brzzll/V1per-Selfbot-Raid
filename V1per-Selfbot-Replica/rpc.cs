using DiscordRPC;

namespace V1per_Selfbot_Replica
{
    internal class rpc
    {
        public static DiscordRpcClient client;
        public static Timestamps rpctimestamp { get; set; }
        private static RichPresence presence;
        public static void InitializeRPC()
        {
            client = new DiscordRpcClient("1268795061500641361");
            client.Initialize();
            Button[] buttons = { 
                new Button() { 
                    Label = "Discord Server", Url = "https://discord.gg/zCQ8jQ2GBf"
                },
                new Button() {
                    Label = "Tutorial", Url = "https://www.youtube.com/watch?v=4TUtp9ERTlE"
                }
            };

            presence = new RichPresence()
            {
                Details = "V1per Selfbot Replica",
                State = "by $ ZenX",
                Timestamps = rpctimestamp,
                Buttons = buttons,

                Assets = new Assets()
                {
                    LargeImageKey = "icon",
                    LargeImageText = "V1per Selfbot Replica",
                    SmallImageKey = "",
                    SmallImageText = ""
                }
            };
            SetState("~ by $ ZenX");
        }
        public static void SetState(string state, bool watching = false)
        {
            presence.State = state;
            client.SetPresence(presence);
        }
    }
}
