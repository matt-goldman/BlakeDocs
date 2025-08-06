using Microsoft.JSInterop;

namespace BlakeSampleDocs.Services;

public class PlatformService(IJSRuntime js)
{
    public bool IsMacOS { get; private set; } = false;

    public async Task InitAsync()
    {
        var result = await js.InvokeAsync<string>("getOS");
        IsMacOS = result == "mac";
    }
}