from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import tempfile, os
from smart_overlayq import auto_overlay

# Create FastAPI app
app = FastAPI(title="Virtual Try-On SaaS")

# ✅ Enable CORS (important for frontend JS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Define static & template directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# 🏠 Home route
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 👗 Try-On AI route
@app.post("/tryon")
async def tryon(user_image: UploadFile = File(...), garment_image: UploadFile = File(...)):
    user_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    garment_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")

    user_temp.write(await user_image.read())
    garment_temp.write(await garment_image.read())
    user_temp.close()
    garment_temp.close()

    try:
        auto_overlay(user_temp.name, garment_temp.name, output_temp.name)
    except Exception as e:
        print("❌ AI Overlay Error:", e)
        return {"error": str(e)}

    with open(output_temp.name, "rb") as f:
        result_bytes = f.read()

    return Response(content=result_bytes, media_type="image/png")
