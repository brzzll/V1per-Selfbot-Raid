using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;
using System.Windows.Forms;
using DiscordRPC;

namespace V1per_Selfbot_Replica
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            panelToken.Visible = true;
            panelEmbedUser.Visible = false;
            panelCommands.Visible = false;
            rpc.rpctimestamp = Timestamps.Now;
            rpc.InitializeRPC();
            if (!File.Exists("by-ZenX-gg-zCQ8jQ2GBf.zx")) { this.Close(); };
            Process[] processes = Process.GetProcessesByName("node");
            if (processes.Length > 0) { foreach (Process process in processes) { process.Kill(); } }
        }
        public string user_token = "";
        public string user_embed = "";
        public int xClick = 0, yClick = 0;
        private void guna2Panel1_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.Button != MouseButtons.Left) { xClick = e.X; yClick = e.Y; } else { this.Left = this.Left + (e.X - xClick); this.Top = this.Top + (e.Y - yClick); }
        }

        private void buttonGetToken_Click(object sender, EventArgs e)
        {
            user_token = textBoxToken.Text;
            panelToken.Visible = false;
            panelEmbedUser.Visible = true;
        }

        private void buttonEmbedUser_Click(object sender, EventArgs e)
        {
            user_embed = textBoxEmbedUser.Text;
            panelEmbedUser.Visible = false;
            selfbot_init();
            panelCommands.Visible = true;
        }

        private void guna2ControlBox1_Click(object sender, EventArgs e)
        {
            Process[] processes = Process.GetProcessesByName("node");
            if (processes.Length > 0) { foreach (Process process in processes) { process.Kill(); } }
            this.Close();
        }

        public async void selfbot_init() {
            await Task.Run(() => {
                string rute = @"./motor-node/index.js";
                Process procesoNode = new Process();
                procesoNode.StartInfo.FileName = "node.exe";
                procesoNode.StartInfo.Arguments = $"{rute} {user_token} {user_embed}";
                procesoNode.StartInfo.RedirectStandardOutput = true;
                procesoNode.StartInfo.UseShellExecute = false;
                procesoNode.StartInfo.CreateNoWindow = true;
                procesoNode.StartInfo.RedirectStandardError = true;
                procesoNode.Start();
                procesoNode.BeginOutputReadLine();
                procesoNode.WaitForExit();
            });
        }
    }
}
